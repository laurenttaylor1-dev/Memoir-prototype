export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const ext = url.searchParams.get('ext') || 'webm';
    const form = await req.formData();

    // Incoming blob and hints
    const audio = form.get('audio'); // Blob/File
    const prompt = form.get('prompt') || '';
    const lang   = form.get('lang') || ''; // 'en','fr','es','nl'

    if (!audio) {
      return new Response(JSON.stringify({ error: 'Missing audio' }), { status: 400 });
    }

    // Build multipart for OpenAI Whisper
    const fd = new FormData();
    fd.append('file', audio, `chunk.${ext}`);
    fd.append('model', 'whisper-1');          // or gpt-4o-mini-transcribe
    if (lang)   fd.append('language', lang);  // helps accuracy
    if (prompt) fd.append('prompt', prompt);  // brief context tail to improve continuity
    // You can also tweak:
    // fd.append('temperature', '0');

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: fd
    });

    if (!r.ok) {
      const err = await r.text().catch(()=>'');
      return new Response(JSON.stringify({ error: 'whisper_failed', details: err }), { status: 502 });
    }

    const json = await r.json();
    // The "text" field contains Whisper output
    return new Response(JSON.stringify({ text: json.text || '' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
