// api/transcribe-chunk.js
import { getOpenAiKey, getTranscribeModel } from './_config.js';

export const config = { api: { bodyParser: false } }; // multipart/form-data

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

    const apiKey = getOpenAiKey();
    if (!apiKey) return res.status(500).json({ error: 'missing_openai_key' });

    // Read the incoming multipart/form-data
    const form = await readFormData(req);
    const audioFile = form.get('audio');
    const language  = (form.get('language') || 'en').toString();

    if (!audioFile) return res.status(400).json({ error: 'missing_audio' });

    // Prepare form for OpenAI
    const model = getTranscribeModel();
    const out = new FormData();

    out.append('model', model);
    // NOTE: "response_format" is the correct name
    out.append('response_format', 'json');
    out.append('temperature', '0');
    out.append('language', language);

    // Ensure we pass a proper Blob/File with a filename
    const name = audioFile?.name || 'recording.webm';
    const type = audioFile?.type || 'audio/webm';

    if (typeof audioFile.arrayBuffer === 'function') {
      const buf = await audioFile.arrayBuffer();
      out.append('file', new Blob([buf], { type }), name);
    } else {
      // Some runtimes already give you a File/Blob
      out.append('file', audioFile, name);
    }

    // Call OpenAI
    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: out
    });

    // Helpful diagnostics if something goes wrong
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      return res.status(r.status).json({
        error: 'openai_error',
        status: r.status,
        detail: safeTail(text, 4000) // trim for safety
      });
    }

    const data = await r.json().catch(() => null);
    if (!data || typeof data.text !== 'string') {
      return res.status(502).json({ error: 'invalid_openai_response' });
    }

    return res.json({ partial: data.text || '' });
  } catch (err) {
    console.error('[transcribe-chunk] fail', err);
    return res.status(500).json({ error: 'server_error', detail: String(err?.message || err) });
  }
}

/* ---------- helpers ---------- */

// Parse multipart without any third-party libs (Node 18+ / Web APIs)
async function readFormData(req) {
  const contentType = req.headers['content-type'] || '';
  const boundary = contentType.split('boundary=')[1];
  if (!boundary) throw new Error('No multipart boundary');

  const buffer = await streamToBuffer(req);
  // IMPORTANT: just call .formData() to get a FormData instance
  const resp = new Response(buffer, { headers: { 'Content-Type': contentType } });
  return await resp.formData();
}

function streamToBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function safeTail(s, max) {
  if (!s) return '';
  const str = String(s);
  return str.length > max ? str.slice(-max) : str;
}
