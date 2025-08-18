// /api/health.js  (Node runtime, concise production version)
export default async function handler(req, res) {
  const base = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const url  = base + "/auth/v1/health";

  try {
    const r = await fetch(url, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY || "" },
      // tiny timeout to avoid hanging
      cache: "no-store",
    });
    if (!r.ok) {
      const body = await r.text().catch(() => "");
      return res.status(r.status).json({ ok: false, status: r.status, service: "auth", body });
    }
    return res.status(200).json({ ok: true, status: 200, service: "auth" });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      status: 500,
      error: "fetch_failed",
      message: String(e),
    });
  }
}
