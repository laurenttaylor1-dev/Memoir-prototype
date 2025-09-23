// api/voice.js
// Vercel/Next.js Node runtime function to synthesize short snippets with ElevenLabs

export const config = { api: { bodyParser: false } };

const API_KEY  = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // "Rachel" (public demo voice id)
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2';      // or 'eleven_monolingual_v1'

export default async function handler(req, res) {
  try {
    if (!API_KEY) return res.status(500).json({ error: 'missing_elevenlabs_key' });

    if (req.method !== 'POST' && req.method !== 'GET') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    // Accept either JSON ({ text }) or query (?text=)
    let text = '';
    if (req.method === 'GET') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      text = url.searchParams.get('text') || '';
    } else {
      const raw = await readBody(req);
      try {
        const json = JSON.parse(raw || '{}');
        text = (json.text || '').toString();
      } catch {
        text = '';
      }
    }

    text = (text || '').trim();
    if (!text) return res.status(400).json({ error: 'missing_text' });

    // Build ElevenLabs request
    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    const body = {
      model_id: MODEL_ID,
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.1,
        use_speaker_boost: true
      }
    };

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      let detail = null;
      try { detail = await r.json(); } catch { detail = await r.text(); }
      return res.status(r.status).json({ error: 'tts_failed', detail });
    }

    // Proxy audio bytes to the browser
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    r.body.pipe(res);
  } catch (e) {
    console.error('[voice] error', e);
    res.status(500).json({ error: String(e?.message || e) });
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const parts = [];
    req.on('data', (c) => parts.push(c));
    req.on('end', () => resolve(Buffer.concat(parts).toString('utf8')));
    req.on('error', reject);
  });
}
