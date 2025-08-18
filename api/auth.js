export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const base = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const apikey = process.env.SUPABASE_ANON_KEY || "";
  const { action, email, password, redirectTo } = req.body || {};

  const headers = {
    apikey,
    Authorization: `Bearer ${apikey}`,
    "Content-Type": "application/json",
  };

  async function forward(path, body) {
    const url = `${base}${path}`;
    const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    const text = await r.text();
    let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!r.ok) return res.status(r.status).json({ error: data.error || data.raw || "server_error", debug: { url, status: r.status, data } });
    return res.status(200).json(data);
  }

  try {
    if (action === "signin")   return forward("/auth/v1/token?grant_type=password", { email, password });
    if (action === "signup")   return forward("/auth/v1/signup",                 { email, password });
    if (action === "magiclink")return forward("/auth/v1/magiclink",              { email, redirect_to: redirectTo });
    return res.status(400).json({ error: "unknown_action" });
  } catch (e) {
    return res.status(500).json({ error: "server_error", details: String(e) });
  }
}
