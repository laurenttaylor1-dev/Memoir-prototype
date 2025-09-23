// /js/supabase-client.js
(function(){
  const url  = window.MEMOIR_SUPABASE_URL || "https://fswxkujxusdozvmpyvzk.supabase.co";
  const anon = window.MEMOIR_SUPABASE_ANON || "YOUR_ANON_KEY";

  let loader = null;
  let client = null;

  async function loadSDK(){
    if (window.supabase?.createClient) return;
    if (loader) return loader;
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.onload = () => resolve();
      s.onerror = () => { loader=null; reject(new Error("Supabase SDK failed")); };
      document.head.appendChild(s);
    });
    return loader;
  }

  window.getSupabase = async function(){
    if (client) return client;
    await loadSDK();
    client = window.supabase.createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return client;
  };
})();
