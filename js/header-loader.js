// /js/header-loader.js
(async function () {
  const slot = document.getElementById('site-header');
  if (!slot) return;

  // Inject header partial
  try {
    const res = await fetch('/partials/header.html', { cache: 'no-store' });
    if (!res.ok) throw new Error('header fetch failed');
    slot.innerHTML = await res.text();
  } catch (e) {
    console.warn('[header-loader] failed, using minimal fallback', e);
    slot.innerHTML = `
      <header class="site-header">
        <div class="wrap" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <a class="brand" href="/landing.html">
            <span class="logo"></span>
            <span class="brand-text">
              <strong>MEMOIR APP</strong>
              <small>Preserve your memories forever</small>
            </span>
          </a>
          <nav class="nav">
            <a class="pill" href="/landing.html">Home</a>
            <a class="pill" href="/login.html">Login</a>
          </nav>
        </div>
      </header>`;
  }

  // Language menu (unchanged)
  const wrap   = document.getElementById('lang-menu') || slot.querySelector('.lang, [data-lang-wrap]');
  const toggle = document.getElementById('lang-toggle') || slot.querySelector('[data-lang-toggle], .lang-toggle');
  const menu   = document.getElementById('lang-dropdown') || slot.querySelector('.lang-menu,[data-lang-menu]');
  const items  = menu ? menu.querySelectorAll('.lang-item,[data-lang]') : [];
  const I18N   = window.MEMOIR_I18N;
  const getLang = () => (I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');
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

  const nav = slot.querySelector('.nav');
  const pill = document.createElement('span');
  pill.id = 'session-pill';
  pill.className = 'pill';
  pill.style.marginLeft = '8px';
  pill.style.opacity = '0.95';

  function showSignedOut() {
    pill.innerHTML = `<a class="pill" href="/login.html">Sign in</a>`;
    nav && nav.appendChild(pill);
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
      if (!user) return showSignedOut();

      // Try to fetch profile name
      let label = user.email || 'account';
      try {
        const { data } = await sb.from('profiles').select('full_name').eq('user_id', user.id).single();
        if (data?.full_name) {
          const first = (data.full_name || '').split(/\s+/)[0];
          label = `${first} (${user.email})`;
        }
      } catch {}

      pill.innerHTML = `
        <span class="muted" style="font-weight:600">Signed in as ${label}</span>
        <a class="pill" href="/settings.html">Settings</a>
        <button class="pill" id="session-signout">Sign out</button>
      `;
      nav && nav.appendChild(pill);
      pill.querySelector('#session-signout')?.addEventListener('click', async ()=>{
        await sb.auth.signOut();
        location.href = '/login.html';
      });
    } catch (e) {
      console.warn('[header-loader] session render failed', e);
      showSignedOut();
    }
  }

  await renderSession();
  window.addEventListener('focus', renderSession);

  console.log('[header-loader] loaded');
})();
