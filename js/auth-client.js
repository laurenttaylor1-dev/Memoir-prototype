// /js/auth-client.js
// Centralized, CSP-safe Supabase client bootstrapper.
// - Reads config from <meta name="supabase-url"> and <meta name="supabase-anon">
//   with fallbacks to window.MEMOIR_SUPABASE_URL / MEMOIR_SUPABASE_ANON.
// - Loads @supabase/supabase-js@2 only once.
// - Exposes window.MEMOIR_AUTH.{ensureClient,getSession,getUser,signOut}

(function () {
  const STATE = {
    client: null,
    loader: null,
    config: null,
    listening: false,
  };

  function readMeta(name) {
    const el = document.querySelector(`meta[name="${name}"]`);
    return el && el.content ? el.content.trim() : '';
  }

  function readConfig() {
    if (STATE.config) return STATE.config;

    const fromMetaUrl  = readMeta('supabase-url');
    const fromMetaAnon = readMeta('supabase-anon');

    const url  =
      fromMetaUrl ||
      window.MEMOIR_SUPABASE_URL ||
      window.SUPABASE_URL ||
      '';

    const anon =
      fromMetaAnon ||
      window.MEMOIR_SUPABASE_ANON ||
      window.SUPABASE_ANON_KEY ||
      '';

    if (!url || !anon) {
      const missing = !url ? 'supabaseUrl' : 'supabaseAnonKey';
      const err = new Error(`${missing} is required.`);
      err.code = 'CONFIG_MISSING';
      throw err;
    }

    STATE.config = { url, anon };
    // also reflect onto window so other scripts can use it
    window.MEMOIR_SUPABASE_URL  = url;
    window.MEMOIR_SUPABASE_ANON = anon;
    return STATE.config;
  }

  function loadSDK() {
    if (window.supabase?.createClient) return Promise.resolve();
    if (STATE.loader) return STATE.loader;

    STATE.loader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = () => resolve();
      s.onerror = () => {
        STATE.loader = null;
        reject(new Error('Supabase SDK failed to load.'));
      };
      document.head.appendChild(s);
    });

    return STATE.loader;
  }

  async function ensureClient() {
    if (STATE.client) return STATE.client;
    const cfg = readConfig();
    await loadSDK();

    // Validate again in case config changed between time
    if (!cfg.url || !cfg.anon)
      throw new Error('supabaseUrl is required.');

    STATE.client = window.supabase.createClient(cfg.url, cfg.anon, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });

    // Re-broadcast auth changes (optional, but useful for header-loader)
    if (!STATE.listening) {
      STATE.listening = true;
      STATE.client.auth.onAuthStateChange(() => {
        window.dispatchEvent(new CustomEvent('memoir:auth', { detail: { ts: Date.now() } }));
      });
    }

    return STATE.client;
  }

  // Helpers with a timeout guard (avoids endless “Checking…” UIs)
  function withTimeout(promise, ms = 8000) {
    return Promise.race([
      promise,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
    ]);
  }

  async function getSession() {
    const c = await ensureClient();
    const { data } = await withTimeout(c.auth.getSession());
    return data?.session || null;
  }

  async function getUser() {
    const c = await ensureClient();
    const { data } = await withTimeout(c.auth.getUser());
    return data?.user || null;
  }

  async function signOut() {
    const c = await ensureClient();
    return c.auth.signOut();
  }

  window.MEMOIR_AUTH = {
    ensureClient,
    getSession,
    getUser,
    signOut,
  };
})();
