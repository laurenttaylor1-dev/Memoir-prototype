// /js/auth-client.js
(() => {
  const STATE = {
    loader: null,
    client: null,
    config: null,
  };

  // Where to load the SDK from
  const SDK_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

  function readMeta(name) {
    const el = document.querySelector(`meta[name="${name}"]`);
    return el ? (el.getAttribute('content') || '').trim() : '';
    // must be present in each HTML file OR use the window fallbacks below
  }

  function readConfig() {
    if (STATE.config) return STATE.config;

    // 1) Preferred: meta tags (CSP-safe)
    let url = readMeta('supabase-url');
    let anon = readMeta('supabase-anon');

    // 2) Fallback: window globals (if you set them elsewhere)
    if (!url)  url  = (window.MEMOIR_SUPABASE_URL || window.SUPABASE_URL || '').trim();
    if (!anon) anon = (window.MEMOIR_SUPABASE_ANON || window.SUPABASE_ANON_KEY || '').trim();

    STATE.config = { url, anon };
    return STATE.config;
  }

  async function loadSDK() {
    if (window.supabase?.createClient) return;
    if (STATE.loader) return STATE.loader;
    STATE.loader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SDK_URL;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load supabase-js SDK'));
      document.head.appendChild(s);
    });
    return STATE.loader;
  }

  function validateConfig(cfg) {
    if (!cfg?.url)  throw new Error('supabaseUrl is required.');
    if (!cfg?.anon) throw new Error('supabaseAnonKey is required.');
  }

  async function ensureClient() {
    if (STATE.client) return STATE.client;

    const cfg = readConfig();
    validateConfig(cfg);
    await loadSDK();

    STATE.client = window.supabase.createClient(cfg.url, cfg.anon, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    return STATE.client;
  }

  // Small helper frequently needed by pages
  async function getUser() {
    const supa = await ensureClient();
    const { data } = await supa.auth.getUser();
    return data?.user || null;
  }

  // expose a single API
  window.MEMOIR_AUTH = {
    ensureClient,
    getUser,
    get config() { return readConfig(); },
  };
})();
