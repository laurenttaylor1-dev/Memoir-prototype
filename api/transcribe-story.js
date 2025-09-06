import { createClient } from '@supabase/supabase-js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { story_id } = req.body||{};
  if(!story_id) return res.status(400).json({error:'missing story_id'});

  const sb=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

  const {data:story}=await sb.from('stories').select('id,audio_path,language').eq('id',story_id).single();
  if(!story) return res.status(404).json({error:'story not found'});

  const {data:signed}=await sb.storage.from('memoir-audio').createSignedUrl(story.audio_path,600);
  const audioBuf=Buffer.from(await (await fetch(signed.signedUrl)).arrayBuffer());

  const form=new FormData();
  form.append('model','whisper-1');
  form.append('file',new Blob([audioBuf],{type:'audio/webm'}),'audio.webm');

  const r=await fetch('https://api.openai.com/v1/audio/transcriptions',{
    method:'POST',
    headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
    body:form
  });
  const out=await r.json();

  await sb.from('stories').update({transcript:out.text||'',transcription_status:'done'}).eq('id',story_id);
  res.json({ok:true,text:out.text});
}
