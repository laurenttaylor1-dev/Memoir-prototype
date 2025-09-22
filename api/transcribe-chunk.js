// api/transcribe-chunk.js
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
    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${process.env.OPENAI_API_KEY}` },
      body: formDataForOpenAI(audioFile, language)
    });
    if(!r.ok){
      const t = await r.text();
      return res.status(400).json({ error:'chunk_failed', detail: t });
    }
    const out = await r.json(); // { text: "..." }
    const text = out.text || '';
    res.json({ text, partial: text });
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

function formDataForOpenAI(file, language){
  const fd = new FormData();
  fd.append('model', 'whisper-1'); // or a streaming-capable variant if/when available
  fd.append('file', file, 'chunk.webm');
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
