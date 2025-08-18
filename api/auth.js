export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const { action, email, password, redirectTo } = req.body || {};
  const base = process.env.SUPABASE_URL;
  const apikey = process.env.SUPABASE_ANON_KEY;
  const headers = {
    apikey,
    Authorization: `Bearer ${apikey}`,
    'Content-Type': 'application/json'
  };

  try {
    let url, init, r, data;

    if (action === 'signup') {
      url = `${base}/auth/v1/signup`;
      init = { method: 'POST', headers, body: JSON.stringify({ email, password }) };
      r = await fetch(url, init);
      data = await r.json();
      return res.status(r.status).json(data);
    }

    if (action === 'signin') {
      // password grant -> returns access/refresh tokens
      url = `${base}/auth/v1/token?grant_type=password`;
      init = { method: 'POST', headers, body: JSON.stringify({ email, password }) };
      r = await fetch(url, init);
      data = await r.json();
      return res.status(r.status).json(data);
    }

    if (action === 'magiclink') {
      url = `${base}/auth/v1/magiclink`;
      init = { method: 'POST', headers, body: JSON.stringify({ email, redirect_to: redirectTo }) };
      r = await fetch(url, init);
      data = await r.json().catch(() => ({}));
      return res.status(r.status).json(data);
    }

    return res.status(400).json({ error: 'unknown_action' });
  } catch (e) {
    return res.status(500).json({ error: 'server_error', details: String(e) });
  }
}
