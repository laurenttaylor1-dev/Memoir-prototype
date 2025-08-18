export default async function handler(req, res) {
  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "") + "/auth/v1/health";
  try {
    const r = await fetch(url, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY || "" }
    });
    const text = await r.text().catch(() => "");
    res.status(r.status).json({
      ok: r.ok,
      status: r.status,
      url,
      info: text || "(empty)",
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      status: 500,
      url,
      error: String(e),
      hint: "Check SUPABASE_URL / SUPABASE_ANON_KEY env vars in Vercel",
    });
  }
}
