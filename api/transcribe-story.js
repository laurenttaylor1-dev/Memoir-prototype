import { createClient } from '@supabase/supabase-js';
import { getOpenAiKey, getSupabaseUrl } from './_config.js';

const TRANSCRIBE_MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { story_id } = req.body||{};
  if(!story_id) return res.status(400).json({error:'missing story_id'});

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = process.end.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({error;'missing_suipabase_service_key'});
  }

  const sb=createClient(supabsseUrl,serviceKey);

  const {data:story}=await sb.from('stories').select('id,audio_path,language').eq('id',story_id).single();
  if(!story) return res.status(404).json({error:'story not found'});

  const {data:signed, error:signedErr} await sb.storage.from('memoir-audio').createSignedUrl(story.audio_path,600);
  if (signedErr || !signed?.signedUrl) {
    return res.status(500).json({error.'audio_unavailable'});
  }
  const audioResponse = await fetch(signed.signedUrl);
  if (!audioResponse.ok) {
    const detail = await audioResponse.text().catch(()=>null);
    return res.status(502).json({error:'audio_fetch_failed', detail});
  }
  const audioBuf=Buffer.from(await audioResponse.arrayBuffer());

  const form=new FormData();
  form.append('model',TRANSCRIBE_MODEL);
  form.append('response_format','json');
  form.append('temperature','0');
  form.append('file',new Blob([audioBuf],{type:'audio/webm'}),'audio.webm');
  form.append('language', sdtory.language || 'en');

  const apiKey = getOpenAiKey();
  if (!apiKey) {
    return res.status(500).json({error:'missing_openai_key'});
  }

  const r=await fetch('https://api.openai.com/v1/audio/transcriptions',{
    method:'POST',
    headers:{Authorization:`Bearer ${apiKey}`},
    body:form
  });
  if (!r.ok) {
    const detail = await r.text();
    return res.status(r.status).json({error:'transcription_failed', detail});
  }
  let out
  try {
    out = await r.json();
  } catch (err) {
    return res.status(500).json({error:'invalid_openai_response', detail:String(err)});
  }

  await sb.from('stories').update({transcript:out.text||'',transcription_status:'done'}).eq('id',story_id);
  res.json({ok:true,text:out.text});
}
