// /api/transcribe-story.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res){
  if(req.method !== 'POST'){ res.status(405).end(); return; }
  try{
    const { story_id } = req.body || {};
    if(!story_id) return res.status(400).json({ error:'missing story_id' });

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const OPENAI_KEY   = process.env.OPENAI_API_KEY;

    const sb = createClient(SUPABASE_URL, SERVICE_KEY);

    // 1) load story
    const { data: story, error: getErr } = await sb
      .from('stories')
      .select('id,audio_path,language,transcription_status')
      .eq('id', story_id)
      .single();
    if(getErr) return res.status(404).json({ error:getErr.message });
    if(!story.audio_path) return res.status(400).json({ error:'no audio_path on story' });

    // 2) signed URL to audio
    const { data: signed, error: urlErr } = await sb
      .storage.from('memoir-audio')
      .createSignedUrl(story.audio_path, 60*10);
    if(urlErr) return res.status(400).json({ error:urlErr.message });

    // set processing
    await sb.from('stories').update({ transcription_status:'processing' }).eq('id', story_id);

    // 3) download audio
    const audioResp = await fetch(signed.signedUrl);
    const audioBuf = Buffer.from(await audioResp.arrayBuffer());

    // 4) OpenAI Whisper call
    // If you use the new client: @openai/openai (2025). Adjust if your project uses old SDK.
    const form = new FormData();
    form.append('model', 'whisper-1');               // or 'gpt-4o-mini-transcribe' if you migrated
    form.append('file', new Blob([audioBuf], { type:'audio/webm' }), 'audio.webm');
    form.append('language', story.language || 'en');

    const ow = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${OPENAI_KEY}` },
      body: form
    });
    if(!ow.ok){
      const errText = await ow.text();
      await sb.from('stories').update({ transcription_status:'error' }).eq('id', story_id);
      return res.status(400).json({ error:'whisper_failed', detail: errText });
    }
    const out = await ow.json();       // { text: "..." }

    // 5) update story
    await sb.from('stories').update({
      transcript: out.text || '',
      transcription_status: 'done'
    }).eq('id', story_id);

    res.json({ ok:true, text: out.text || '' });
  }catch(e){
    console.error(e);
    res.status(500).json({ error:String(e) });
  }
}
