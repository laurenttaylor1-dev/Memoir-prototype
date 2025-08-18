// Minimal ElevenLabs proxy.
// Requires Vercel env var: ELEVENLABS_API_KEY
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // Accept either JSON body from edge/standard fetch
    const body = req.body || (await new Promise((r) => {
      let data = '';
      req.on('data', (c) => (data += c));
      req.on('end', () => {
        try { r(JSON.parse(data || '{}')); } catch { r({}); }
      });
    }));

    const { text, voiceId, model = 'eleven_multilingual_v2' } = body || {};

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: 'missing_text' });
    }
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'missing_server_api_key' });
    }

    // Default voice: Rachel (good general multilingual baseline)
    // You can change this per language on the client by sending voiceId.
    const vid = voiceId || '21m00Tcm4TlvDq8ikWAM';

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(vid)}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: String(text),
        model_id: model,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });

    if (!r.ok) {
      const msg = await r.text().catch(() => '');
      return res.status(r.status).json({ error: 'elevenlabs_error', detail: msg });
    }

    const arr = await r.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(Buffer.from(arr));
  } catch (e) {
    console.error('voice.js error:', e);
    return res.status(500).json({ error: 'tts_server_error', detail: String(e) });
  }
}
