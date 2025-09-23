// /js/header-loader.js
(async function () {
  const slot = document.getElementById('site-header');
  if (!slot) return;

  const I18N = window.MEMOIR_I18N;

  function localize(root) {
    try { I18N?.applyAll?.(root || slot); } catch (e) { /* ignore */ }
  }

  // Inject header partial (or minimal fallback)
  try {
    const res = await fetch('/partials/header.html', { cache: 'no-store' });
    if (!res.ok) throw new Error('header fetch failed');
    slot.innerHTML = await res.text();
  } catch {
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
  }
  localize(slot);

  // Language menu (unchanged, just re-apply)
  const toggle = slot.querySelector('[data-lang-toggle], .lang-toggle');
  const menu   = slot.querySelector('.lang-menu,[data-lang-menu]');
  const items  = menu ? menu.querySelectorAll('.lang-item,[data-lang]') : [];
  function setLabelFrom(code) {
    const map = { en:'🇬🇧 English', fr:'🇫🇷 Français', nl:'🇧🇪 Nederlands', es:'🇪🇸 Español' };
    const label = map[code] || map.en;
    const [flag, ...rest] = label.split(' ');
    const flagEl = slot.querySelector('#lang-current-flag');
    const nameEl = slot.querySelector('#lang-current-label');
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
        const code = btn.dataset.lang || 'en';
        try {
          localStorage.setItem('memoir.lang', code);
          window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
          I18N?.apply?.(code, document);
        } catch {}
        setLabelFrom(code);
        menu.hidden = true;
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      });
    });
    document.addEventListener('click', (ev) => {
      if (menu.hidden) return;
      if (!menu.contains(ev.target) && !toggle.contains(ev.target)) {
        menu.hidden = true; menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') { menu.hidden = true; menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
    });
    const code = localStorage.getItem('memoir.lang') || 'en';
    setLabelFrom(code);
  }

  // -------- Session pill (uses the shared auth client) --------
  const sessionSlot = slot.querySelector('#session-slot');

  function showSignedOut() {
    if (!sessionSlot) return;
    sessionSlot.hidden = false;
    sessionSlot.innerHTML = '<a class="pill primary" href="/login.html" data-i18n="navLogin">Sign in</a>';
    localize(sessionSlot);
  }
  function hideSession() {
    if (!sessionSlot) return;
    sessionSlot.hidden = true;
    sessionSlot.innerHTML = '';
  }

  async function renderSession() {
    try {
      const supa = await window.MEMOIR_AUTH.ensureClient();
      const { data } = await supa.auth.getUser();
      const user = data?.user || null;
      if (!user) { showSignedOut(); return; }
      hideSession();
    } catch (e) {
      console.warn('[header-loader] session render failed', e);
      showSignedOut();
    }
  }

  await renderSession();
  window.addEventListener('focus', renderSession);
  window.addEventListener('memoir:lang', () => {
    localize(slot);
    // keep pill state, only relocalize text
  });

  console.log('[header-loader] loaded');
})();
