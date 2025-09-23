// api/transcribe-chunk.js
import { getOpenAiKey } from './_config.js';

// Allow either env var; default to whisper-1 (stable + broadly available)
const MODEL =
  process.env.OPENAI_TRANSCRIBE_MODEL ||
  process.env.OPENAI_TRANCRIBE_MODEL || // backward-compat with the misspelled name
  'whisper-1';

export const config = { api: { bodyParser: false } }; // we parse multipart ourselves

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    // --- Parse multipart form (Node 18+ Web API path) ---
    const formData = await readFormData(req);
    const audioFile = formData.get('audio');
    const language  = formData.get('language') || 'en';

    if (!audioFile) {
      return res.status(400).json({ error: 'missing_audio' });
    }

    const apiKey = getOpenAiKey();
    if (!apiKey) {
      return res.status(500).json({ error: 'missing_openai_key' });
    }

    // --- Prepare body for OpenAI /audio/transcriptions ---
    const fd = new FormData();
    fd.append('model', MODEL);
    // NOTE: response_format is optional; json is default, but we set it explicitly.
    fd.append('response_format', 'json');
    fd.append('temperature', '0');

    // If you want to hint language; Whisper will auto-detect if omitted.
    if (language) fd.append('language', language);

    // We already have a File from the incoming multipart.
    // Pass it straight through, keeping original name & type.
    const filename = audioFile.name || 'chunk.webm';
    fd.append('file', audioFile, filename);

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: fd,
    });

    if (!r.ok) {
      // Try to parse JSON error, fall back to raw text
      let details = null;
      try { details = await r.json(); } catch { details = await r.text(); }
      return res.status(r.status).json({ error: 'chunk_failed', detail: details });
    }

    const out = await r.json(); // { text: "..." }
    return res.status(200).json({ partial: out?.text || '' });
  } catch (e) {
    console.error('[transcribe-chunk] fatal', e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
}

/* -------- helpers -------- */

async function readFormData(req) {
  // Read the raw body because we disabled Next/Vercel bodyParser
  const buf = await streamToBuffer(req);
  const ct = req.headers['content-type'] || '';
  if (!/multipart\/form-data/i.test(ct)) throw new Error('invalid_content_type');
  // Use Web Response to parse FormData (Node 18+ / undici)
  const resLike = new Response(buf, { headers: { 'Content-Type': ct } });
  return await resLike.formData();
}

function streamToBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
