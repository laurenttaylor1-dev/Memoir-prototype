// /api/health.js — deep diagnostics (safe to deploy)
export default async function handler(req, res) {
  const rawUrl = process.env.SUPABASE_URL || "";
  const url = rawUrl.replace(/\/+$/, "") + "/auth/v1/health";
  const key = process.env.SUPABASE_ANON_KEY || "";

  async function ping(target, opts = {}) {
    try {
      const r = await fetch(target, opts);
      const txt = await r.text().catch(() => "");
      return { ok: r.ok, status: r.status, url: target, body: txt.slice(0, 300) };
    } catch (e) {
      return { ok: false, status: 0, url: target, error: String(e), code: e?.cause?.code };
    }
  }

  const results = {};

  // 0) Echo what the function sees (no secrets)
  results.env = {
    SUPABASE_URL: rawUrl,
    SUPABASE_URL_trimmed: url.replace("/auth/v1/health", ""),
    ANON_KEY_LEN: key.length,
    ANON_KEY_PREFIX: key ? key.slice(0, 12) + "…" : "",
  };

  // 1) Can this function reach *any* HTTPS host?
  results.google = await ping("https://www.google.com", { method: "HEAD" });

  // 2) Can it reach the Supabase *domain* (root)?
  results.sb_root = await ping(rawUrl || "https://invalid-host.example");

  // 3) Can it reach the Supabase auth health endpoint?
  results.sb_health = await ping(url, { headers: { apikey: key } });

  // 4) Optional: Edge vs Node hint
  results.runtime = { node: process.version, platform: process.platform };

  return res.status(results.sb_health.ok ? 200 : 500).json(results);
}
