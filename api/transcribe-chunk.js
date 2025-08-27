// api/transcribe-chunk.js
// Progressive (chunked) transcription endpoint.
// POST multipart/form-data with fields:
//  - audio: the chunk (Blob)
//  - lang: optional ISO language hint ("fr", "nl", "en", "es")
//  - seq:  optional sequence number (for your logging needs)
//
// Env: OPENAI_API_KEY  (and optionally OPENAI_TRANSCRIBE_MODEL)

import OpenAI from "openai";

export const config = { api: { bodyParser: false } };

function parseBoundary(header) {
  const m = /boundary=([^;]+)/i.exec(header || "");
  return m && m[1];
}

async function readRaw(req) {
  // Node runtime buffer reader (works fine on Vercel Node)
  const buf = await new Promise((resolve, reject) => {
    const arr = [];
    req.on("data", (c) => arr.push(c));
    req.on("end", () => resolve(Buffer.concat(arr)));
    req.on("error", reject);
  });
  return buf;
}

function splitParts(raw, boundary) {
  const delim = Buffer.from(`--${boundary}`);
  const endDelim = Buffer.from(`--${boundary}--`);
  const parts = [];
  let start = raw.indexOf(delim);
  if (start < 0) return parts;
  start += delim.length + 2; // skip \r\n after boundary
  while (start < raw.length) {
    const next = raw.indexOf(delim, start);
    const nextEnd = raw.indexOf(endDelim, start);
    const stop = next >= 0 ? next : nextEnd;
    if (stop < 0) break;
    const part = raw.slice(start, stop - 2); // strip trailing \r\n
    parts.push(part);
    if (next < 0) break;
    start = next + delim.length + 2;
  }
  return parts;
}

function parsePart(part) {
  const sep = Buffer.from("\r\n\r\n");
  const idx = part.indexOf(sep);
  const headerBuf = part.slice(0, idx).toString("utf8");
  const body = part.slice(idx + sep.length);
  const headers = {};
  headerBuf.split("\r\n").forEach((line) => {
    const [k, ...v] = line.split(":");
    headers[k.toLowerCase()] = v.join(":").trim();
  });
  return { headers, body };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const contentType = req.headers["content-type"] || req.headers.get?.("content-type");
    const boundary = parseBoundary(contentType);
    if (!boundary) return res.status(400).json({ error: "Invalid multipart/form-data" });

    const raw = await readRaw(req);
    const parts = splitParts(raw, boundary);

    let audioBody = null;
    let filename = "chunk.webm";
    let lang = null;

    for (const p of parts) {
      const { headers, body } = parsePart(p);
      const cd = headers["content-disposition"] || "";
      const name = /name="([^"]+)"/.exec(cd)?.[1];
      const fn = /filename="([^"]+)"/.exec(cd)?.[1];

      if (name === "audio") {
        audioBody = body;
        if (fn) filename = fn;
      } else if (name === "lang") {
        lang = body.toString("utf8").trim();
      }
      // seq is optional; we don't use it server-side.
    }

    if (!audioBody) return res.status(400).json({ error: "Missing 'audio' field" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1";

    // Node 18+ adds global File; if not present, polyfill with formdata-node
    const file = new File([audioBody], filename, { type: "audio/webm" });

    const resp = await client.audio.transcriptions.create({
      file,
      model: MODEL,
      language: lang || undefined,
    });

    res.status(200).json({ text: resp.text || "" });
  } catch (e) {
    console.error("transcribe-chunk error", e);
    res.status(500).json({ error: e?.message || "transcription_failed" });
  }
}
