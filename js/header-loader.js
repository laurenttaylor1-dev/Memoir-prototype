// /js/header-loader.js
(async function () {
  const slot = document.getElementById('site-header');
  if (!slot) return;

  const I18N = window.MEMOIR_I18N;
  const getLang = () => (I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');

  function localizeHeader(root){
    try {
      I18N?.applyAll?.(root || slot);
    } catch (err) {
      console.warn('[header-loader] localization skipped', err);
    }
  }

  // Inject header partial
  try {
    const res = await fetch('/partials/header.html', { cache: 'no-store' });
    if (!res.ok) throw new Error('header fetch failed');
    slot.innerHTML = await res.text();
    localizeHeader(slot);
  } catch (e) {
    console.warn('[header-loader] failed, using minimal fallback', e);
    slot.innerHTML = `
      <header class="site-header">
        <div class="wrap" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <a class="brand" href="/landing.html">
            <span class="logo"></span>
            <span class="brand-text">
              <strong data-i18n="brandTitle">MEMOIR APP</strong>
              <small data-i18n="brandTagline">Preserve your memories forever</small>
            </span>
          </a>
          <nav class="nav">
            <a class="pill" href="/landing.html" data-i18n="navHome">Home</a>
            <a class="pill" href="/record.html" data-i18n="navRecord">Record</a>
            <a class="pill" href="/stories.html" data-i18n="navStories">My Stories</a>
            <div class="session-slot" id="session-slot">
              <a class="pill primary" href="/login.html" data-i18n="navLogin">Sign in</a>
            </div>
          </nav>
        </div>
      </header>`;
    localizeHeader(slot);
  }

  // Language menu (unchanged)
  const wrap   = document.getElementById('lang-menu') || slot.querySelector('.lang, [data-lang-wrap]');
  const toggle = document.getElementById('lang-toggle') || slot.querySelector('[data-lang-toggle], .lang-toggle');
  const menu   = document.getElementById('lang-dropdown') || slot.querySelector('.lang-menu,[data-lang-menu]');
  const items  = menu ? menu.querySelectorAll('.lang-item,[data-lang]') : [];
  function setLabelFrom(code) {
    const map = { en:'🇬🇧 English', fr:'🇫🇷 Français', nl:'🇧🇪 Nederlands', es:'🇪🇸 Español' };
    const label = map[code] || map.en;
    const [flag, ...rest] = label.split(' ');
    const flagEl = document.getElementById('lang-current-flag') || slot.querySelector('#lang-current-flag');
    const nameEl = document.getElementById('lang-current-label') || slot.querySelector('#lang-current-label');
    if (flagEl) flagEl.textContent = flag;
    if (nameEl) nameEl.textContent = rest.join(' ');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    items.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const code = btn.dataset.lang || btn.getAttribute('data-lang') || 'en';
        try {
          localStorage.setItem('memoir.lang', code);
          window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
          I18N?.apply?.(code);
        } catch {}
        setLabelFrom(code);
        menu.hidden = true;
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      });
    });
    document.addEventListener('click', (ev) => {
      if (menu.hidden) return;
      const t = ev.target;
      const inside = menu.contains(t) || toggle.contains(t) || (wrap && wrap.contains(t));
      if (!inside) { menu.hidden = true; menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
    });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { menu.hidden = true; menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }});
    setLabelFrom(getLang());
  }

  // ---- Session pill with Supabase ----
  const SUPA_URL = window.MEMOIR_SUPABASE_URL || "https://fswxkujxusdozvmpyvzk.supabase.co";
  const SUPA_KEY = window.MEMOIR_SUPABASE_ANON || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzd3hrdWp4dXNkb3p2bXB5dnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTk3MTYsImV4cCI6MjA3MzY5NTcxNn0.kNodFgDXi32w456e475fXvBi9eehX50HX_hVVTDBtXI";

  async function ensureSupabase() {
    if (window.supabase && window.supabase.createClient) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  const sessionSlot = slot.querySelector('#session-slot');

  function showSignedOut() {
    if (!sessionSlot) return;
    sessionSlot.hidden = false;
    sessionSlot.innerHTML = '<a class="pill primary" href="/login.html" data-i18n="navLogin">Sign in</a>';
    localizeHeader(sessionSlot);
  }

  function hideSession() {
    if (!sessionSlot) return;
    sessionSlot.hidden = true;
    sessionSlot.innerHTML = '';
  }

  let sb = null;
  async function renderSession() {
    try {
      await ensureSupabase();
      if (!sb) {
        sb = window.supabase.createClient(SUPA_URL, SUPA_KEY, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
        // react to state changes
        sb.auth.onAuthStateChange(() => renderSession());
      }

      const { data: { user } } = await sb.auth.getUser();
      if (!user) {
        showSignedOut();
        return;
      }

      hideSession();
    } catch (e) {
      console.warn('[header-loader] session render failed', e);
      showSignedOut();
    }
  }

  await renderSession();
  window.addEventListener('focus', renderSession);
  window.addEventListener('memoir:lang', () => {
    setLabelFrom(getLang());
    if (sessionSlot && !sessionSlot.hidden) {
      showSignedOut();
    } else {
      localizeHeader(slot);
    }
  });

  console.log('[header-loader] loaded');
})();
