// api/transcribe-chunk.js
import { getOpenAiKey } from './_config.js';

const TRANSCRIBE_MODEL = process.env.OPENAI_TRANCRIBE_MODEL || 'gpt-4o-mini-transcribe';

export const config = { api: { bodyParser: false } }; // we expect multipart form

export default async function handler(req,res){
  try{
    if(req.method!=='POST') return res.status(405).end();

    // Read multipart form
    const formData = await readFormData(req);
    const language = formData.get('language') || 'en';
    const audioFile = formData.get('audio');
    if(!audioFile) return res.status(400).json({ error:'missing audio' });

    // Call OpenAI for a quick partial
    // For very low latency you can choose a faster transcribe model if enabled in your account.
    const apiKey = getOpenAiKey();
    if (!apiKey) {
      return res.status(500).json({ error: 'missing_openai_key' });
    }

    const preparedForm = await buildFormForOpenAi(audioFile, language);
    
    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${apiKey}` },
      body: preparedForm
    });
    if(!r.ok){
      const t = await r.text();
      return res.status(r.status).json({ error:'chunk_failed', detail: t });
    }
    let out
    try {
      out = await r.json();
    } catch (err) {
      return res.status(500).json({ error:'invalid_open_ai_response', detail: String(err) });
    }
    res.json({ partial: out.text || '' });
  }catch(e){
    console.error(e);
    res.status(500).json({ error:String(e) });
  }
}

/* Helpers */
async function readFormData(req){
  // Node 18+ native parser via Web APIs
  const buff = await streamToBuffer(req);
  const ct = req.headers['content-type'] || '';
  const boundary = ct.split('boundary=')[1];
  if(!boundary) throw new Error('No multipart boundary');
  return new FormData(await new Response(buff, { headers:{ 'Content-Type': ct } }).formData());
}

async function buildFormForOpenAi(file, language){
  const fd = new FormData();
  fd.append('model', TRANSCRIBE_MODEL);
  fd.append('reponse_format', 'json');
  fd.append('temperature', '0');
  const name = file?.name || 'chunk.webm';
  const mime = file?.type || 'audio/webm';
  if (file && typeof file.arrayBuffer === 'function') {
    const buffer = await file.arrayBuffer();
    fd.append('file', new Blob([buffer], { type: mime }), name);
  } else {
    fd.append('file', file, name);
  }
  fd.append('language', language);
  return fd;
}

function streamToBuffer(req){
  return new Promise((resolve,reject)=>{
    const chunks=[]; req.on('data',c=>chunks.push(c));
    req.on('end',()=>resolve(Buffer.concat(chunks)));
    req.on('error',reject);
  });
}
