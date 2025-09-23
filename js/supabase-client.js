// /js/supabase-client.js
// Purpose: compatibility wrapper so older pages that call `getSupabase()`
// reuse the ONE global client from /js/auth-client.js (MEMOIR_AUTH).

(function () {
  // If the new singleton exists, just delegate to it.
  if (window.MEMOIR_AUTH && typeof window.MEMOIR_AUTH.ensureClient === 'function') {
    window.getSupabase = window.MEMOIR_AUTH.ensureClient;
    return;
  }

  // Fallback (in case a page includes this file without auth-client.js).
  // Still create only ONE client and stash it globally.
  const SUPA_URL = window.MEMOIR_SUPABASE_URL || document.querySelector('meta[name="supabase-url"]')?.content || '';
  const SUPA_KEY = window.MEMOIR_SUPABASE_ANON || document.querySelector('meta[name="supabase-anon"]')?.content || '';

  let SDK_LOADING = null;

  function loadSDK() {
    if (window.supabase?.createClient) return Promise.resolve();
    if (SDK_LOADING) return SDK_LOADING;
    SDK_LOADING = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = resolve;
      s.onerror = () => { SDK_LOADING = null; reject(new Error('Supabase SDK failed to load.')); };
      document.head.appendChild(s);
    });
    return SDK_LOADING;
  }

  window.getSupabase = async function getSupabase() {
    if (window.__MEMOIR_SB) return window.__MEMOIR_SB;
    await loadSDK();
    if (!window.supabase?.createClient) throw new Error('Supabase SDK unavailable');
    window.__MEMOIR_SB = window.supabase.createClient(
      SUPA_URL,
      SUPA_KEY,
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
    );
    // Expose a minimal MEMOIR_AUTH shim so future code can reuse it.
    window.MEMOIR_AUTH = window.MEMOIR_AUTH || {};
    window.MEMOIR_AUTH.ensureClient = window.getSupabase;
    return window.__MEMOIR_SB;
  };
})();
