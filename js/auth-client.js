// /js/auth-client.js
// Shared Supabase singleton + SDK loader (CSP-safe, no inline code)

(function () {
  const META_URL  = document.querySelector('meta[name="supabase-url"]');
  const META_ANON = document.querySelector('meta[name="supabase-anon"]');

  const SUPA_URL = META_URL?.content || '';
  const SUPA_KEY = META_ANON?.content || '';

  let SB = null;
  let SDK_LOADING = null;

// Accept 200 or 401 (and anything < 500) as "reachable".
// Only treat true network/CORS failures as unreachable.
function probeConnectivity() {
  const { SUPA_URL } = window.MEMOIR_AUTH?.config || {};
  const base = SUPA_URL || document.querySelector('meta[name="supabase-url"]')?.content || '';
  if (!base) return Promise.resolve(false);

  return fetch(`${base}/auth/v1/health`, { mode: 'cors' })
    .then(res => {
      // If we got a response at all, Supabase is reachable.
      // Many projects return 401 here—consider that OK.
      return res.status < 500;
    })
    .catch(() => false);
}

  function loadSDK() {
    if (window.supabase?.createClient) return Promise.resolve();
    if (SDK_LOADING) return SDK_LOADING;

    SDK_LOADING = new Promise(async (resolve, reject) => {
      // Try jsDelivr (allowed by CSP)
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = () => resolve();
      s.onerror = async () => {
        s.remove();
        // Fallback to ESM (also allowed by CSP in your header)
        try {
          const mod = await import('https://esm.sh/@supabase/supabase-js@2?bundle');
          window.supabase = { createClient: mod.createClient };
          resolve();
        } catch (e) {
          reject(new Error('Supabase SDK failed to load (CDN + ESM).'));
        }
      };
      document.head.appendChild(s);
    });

    return SDK_LOADING;
  }

  async function ensureClient() {
    if (window.__MEMOIR_SB) return (SB = window.__MEMOIR_SB);
    await loadSDK();
    if (!window.supabase?.createClient) throw new Error('Supabase SDK unavailable');
    SB = window.supabase.createClient(
      SUPA_URL,
      SUPA_KEY,
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
    );
    window.__MEMOIR_SB = SB;
    return SB;
  }

  function getReturnPath() {
    const u = new URL(location.href);
    return u.searchParams.get('return') || '/settings.html';
  }

  // Expose a tiny API
  window.MEMOIR_AUTH = {
    ensureClient,
    probeConnectivity,
    getReturnPath,
    get config() { return { SUPA_URL, SUPA_KEY }; }
  };
})();
