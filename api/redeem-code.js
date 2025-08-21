// api/redeem-code.js (ESM)
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: 'no_auth_token' });

    const { code } = (req.body || {});
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ ok: false, error: 'missing_code' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false }
    });

    const { data, error } = await supabase.rpc('redeem_code', { p_code: code.trim() });
    if (error) return res.status(200).json({ ok: false, error: error.message || 'rpc_error' });

    return res.status(200).json(data || { ok: false, error: 'empty_response' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message || 'server_error' });
  }
}
