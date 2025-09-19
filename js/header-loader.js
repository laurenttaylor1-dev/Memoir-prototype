// /js/header-loader.js
(async function () {
  const slot = document.getElementById('site-header');
  if (!slot) return;

  // 1) Inject header partial
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

  // 2) Language menu (robust)
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
  } else {
    console.warn('[header-loader] lang controls not found');
  }

  // 3) Session pill (Supabase)
  const SUPA_URL = window.MEMOIR_SUPABASE_URL;
  const SUPA_KEY = window.MEMOIR_SUPABASE_ANON;
  let supa = null;
  if (window.supabase && SUPA_URL && SUPA_KEY) {
    supa = window.supabase.createClient(SUPA_URL, SUPA_KEY);
  }

  // inject a right-side session pill (keeps your <nav> intact)
  const nav = slot.querySelector('.nav');
  const pill = document.createElement('span');
  pill.className = 'pill';
  pill.style.marginLeft = '8px';
  pill.style.opacity = '0.9';
  pill.id = 'session-pill';

  function showSignedOut() {
    pill.innerHTML = `<a class="pill" href="/login.html">Sign in</a>`;
  }
  async function renderSession() {
    if (!supa || !nav) return;
    const { data: { user } } = await supa.auth.getUser();
    if (user) {
      const email = user.email || 'account';
      pill.innerHTML = `
        <span class="muted" style="font-weight:600">Signed in as ${email}</span>
        <a class="pill" href="/settings.html">Settings</a>
        <button class="pill" id="session-signout">Sign out</button>
      `;
      nav.appendChild(pill);
      pill.querySelector('#session-signout')?.addEventListener('click', async ()=>{
        await supa.auth.signOut();
        location.href = '/login.html';
      });
    } else {
      showSignedOut();
      nav.appendChild(pill);
    }
  }

  if (supa) {
    renderSession();
    // update on tab focus (in case session changes elsewhere)
    window.addEventListener('focus', renderSession);
    try {
      // live listener (optional)
      supa.auth.onAuthStateChange(() => renderSession());
    } catch {}
  }

  console.log('[header-loader] loaded');
})();
