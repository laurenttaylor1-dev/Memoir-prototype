export default async function handler(req, res) {
  try {
    const url = process.env.SUPABASE_URL + '/auth/v1/health';
    const r = await fetch(url, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY }
    });
    const text = await r.text();
    res.status(r.status).send(text || 'ok');
  } catch (e) {
    res.status(500).json({ error: 'server_fetch_failed', details: String(e) });
  }
}
