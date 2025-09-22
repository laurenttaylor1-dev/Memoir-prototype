(function(global){
  const DEFAULT_URL = 'https://fswxkujxusdozvmpyvzk.supabase.co';
  const DEFAULT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzd3hrdWp4dXNkb3p2bXB5dnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTk3MTYsImV4cCI6MjA3MzY5NTcxNn0.kNodFgDXi32w456e475fXvBi9eehX50HX_hVVTDBtXI';

  const url = global.MEMOIR_SUPABASE_URL || DEFAULT_URL;
  const anon = global.MEMOIR_SUPABASE_ANON || DEFAULT_ANON;

  global.MEMOIR_SUPABASE_URL = url;
  global.MEMOIR_SUPABASE_ANON = anon;
  global.SUPABASE_URL = global.SUPABASE_URL || url;
  global.SUPABASE_ANON_KEY = global.SUPABASE_ANON_KEY || anon;

  let loaderPromise = null;
  function loadLibrary(){
    if (global.supabase?.createClient) return Promise.resolve(global.supabase);
    if (loaderPromise) return loaderPromise;
    loaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      script.onload = () => resolve(global.supabase);
      script.onerror = (err) => {
        loaderPromise = null;
        reject(err || new Error('Failed to load supabase-js'));
      };
      document.head.appendChild(script);
    });
    return loaderPromise;
  }

  global.memoirEnsureSupabase = loadLibrary;
  global.memoirCreateSupabaseClient = function(options){
    if (!global.supabase?.createClient) {
      throw new Error('Supabase JS has not been loaded yet. Call memoirEnsureSupabase() first.');
    }
    return global.supabase.createClient(url, anon, options);
  };

  if (global.supabase?.createClient) {
    loaderPromise = Promise.resolve(global.supabase);
  }
})(window);
