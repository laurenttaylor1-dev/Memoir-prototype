// api/transcribe.js
// Vercel serverless function: accepts audio (multipart/form-data) and returns { text }
// Requires env: OPENAI_API_KEY

import OpenAI from "openai";

// Small helper to parse multipart form-data in Vercel edge/node function
export const config = {
  api: { bodyParser: false }, // we'll parse manually
};

function parseBoundary(header) {
  const m = /boundary=([^;]+)/i.exec(header || "");
  return m && m[1];
}

// Minimal multipart parser (good enough for single file field "audio")
async function readMultipart(req) {
  const boundary = parseBoundary(req.headers.get
    ? req.headers.get("content-type")
    : req.headers["content-type"]
  );
  if (!boundary) throw new Error("No multipart boundary.");
  const chunks = [];
  const reader = req.body?.getReader ? req.body.getReader() : null;

  if (reader) {
    // Edge runtime
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } else {
    // Node runtime
    const buf = await new Promise((resolve, reject) => {
      const arr = [];
      req.on("data", (c) => arr.push(c));
      req.on("end", () => resolve(Buffer.concat(arr)));
      req.on("error", reject);
    });
    return { raw: buf, boundary };
  }

  const raw = Buffer.concat(chunks.map((u) => Buffer.from(u)));
  return { raw, boundary };
}

function splitParts(raw, boundary) {
  const delim = Buffer.from(`--${boundary}`);
  const endDelim = Buffer.from(`--${boundary}--`);
  let parts = [];
  let start = raw.indexOf(delim) + delim.length + 2; // skip \r\n
  while (start >= delim.length + 2) {
    const end = raw.indexOf(delim, start);
    const endAlt = raw.indexOf(endDelim, start);
    const stop = end >= 0 ? end : endAlt;
    if (stop < 0) break;
    const part = raw.slice(start, stop - 2); // strip trailing \r\n
    parts.push(part);
    if (end < 0) break;
    start = end + delim.length + 2;
  }
  return parts;
}

function parseHeadersAndBody(part) {
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
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing OPENAI_API_KEY" });
      return;
    }

    const client = new OpenAI({ apiKey });

    // Read form-data
    const { raw, boundary } = await readMultipart(req);
    const parts = splitParts(raw, boundary);

    let audioBody = null;
    let filename = "audio.webm";
    let lang = null; // optional hint

    for (const p of parts) {
      const { headers, body } = parseHeadersAndBody(p);
      const cd = headers["content-disposition"] || "";
      // name="audio" or name="lang"
      const nameMatch = /name="([^"]+)"/.exec(cd);
      const filenameMatch = /filename="([^"]+)"/.exec(cd);
      const name = nameMatch ? nameMatch[1] : null;

      if (name === "audio") {
        if (filenameMatch) filename = filenameMatch[1];
        audioBody = body;
      } else if (name === "lang") {
        lang = body.toString("utf8").trim();
      }
    }

    if (!audioBody) {
      res.status(400).json({ error: "No audio uploaded (field name must be 'audio')." });
      return;
    }

    // Create a File object for the SDK call (Node 18+ has global File; if not, use formdata-node)
    const file = new File([audioBody], filename, { type: "audio/webm" });

    // Prefer a modern speech model if available, fallback to whisper-1
    // If your account supports it, you can switch to "gpt-4o-mini-transcribe".
    const MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1";

    const resp = await client.audio.transcriptions.create({
      file,
      model: MODEL,
      // optional language hint improves accuracy:
      // Use ISO code like "fr", "nl", "en", "es"
      language: lang || undefined,
      // temperature: 0, // usually default is fine
    });

    res.status(200).json({ text: resp.text || "" });
  } catch (e) {
    console.error("transcribe error", e);
    res.status(500).json({ error: e?.message || "transcription_failed" });
  }
}
