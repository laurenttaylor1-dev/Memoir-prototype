// Shared helpers (hero rotation + language dropdown + Supabase client)
(() => {
  // ---- Supabase
  const SUPABASE_URL = window.ENV?.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || '';
  if (!window.supabaseClient && window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
    });
  }

  // ---- hero rotation (landing)
  const heroImg = document.querySelector('[data-hero-img]');
  const images = [
    '/assets/book-1.jpg',
    '/assets/book-2.jpg',
    '/assets/book-3.jpg'
  ];
  if (heroImg) {
    let idx = 0;
    const swap = () => {
      idx = (idx + 1) % images.length;
      heroImg.src = images[idx];
    };
    heroImg.src = images[idx];
    setInterval(swap, 30_000);
  }

  // ---- language dropdown (flag + label)
  const langSelect = document.querySelector('[data-lang]');
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      const v = langSelect.value;
      localStorage.setItem('memoir.lang', v);
      // Optional: navigate to same page but keep language for prompts on record page
    });
    const saved = localStorage.getItem('memoir.lang') || 'en';
    langSelect.value = saved;
  }
})();
