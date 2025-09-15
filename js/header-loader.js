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
        <div class="wrap">
          <a class="brand" href="/landing.html">
            <span class="logo"></span>
            <span class="brand-text">
              <strong>MEMOIR APP</strong>
              <small>Preserve your memories forever</small>
            </span>
          </a>
        </div>
      </header>`;
  }

  // 2) Wire language menu (robust to small markup changes)
  const wrap     = document.getElementById('lang-menu') || slot.querySelector('.lang, [data-lang-wrap]');
  const toggle   = document.getElementById('lang-toggle') || slot.querySelector('[data-lang-toggle], .lang-toggle');
  const menu     = document.getElementById('lang-dropdown') || slot.querySelector('.lang-menu,[data-lang-menu]');
  const items    = menu ? menu.querySelectorAll('.lang-item,[data-lang]') : [];

  const I18N = window.MEMOIR_I18N;
  const getLang = () => (I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');

  if (!toggle || !menu) {
    console.warn('[header-loader] lang controls not found');
    return console.log('[header-loader] loaded');
  }

  function setLabelFrom(code) {
    const map = { en:'🇬🇧 English', fr:'🇫🇷 Français', nl:'🇧🇪 Nederlands', es:'🇪🇸 Español' };
    const label = map[code] || map.en;
    const [flag, ...rest] = label.split(' ');
    const flagEl = document.getElementById('lang-current-flag') || slot.querySelector('#lang-current-flag');
    const nameEl = document.getElementById('lang-current-label') || slot.querySelector('#lang-current-label');
    if (flagEl) flagEl.textContent = flag;
    if (nameEl) nameEl.textContent = rest.join(' ');
  }

  function openMenu() {
    menu.hidden = false;
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    menu.hidden = true;
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    menu.hidden ? openMenu() : closeMenu();
  });

  // Select a language
  items.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const code = btn.dataset.lang || btn.getAttribute('data-lang') || 'en';
      try {
        localStorage.setItem('memoir.lang', code);
        window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
        I18N?.apply?.(code);          // in case lang.js exposes apply()
      } catch {}
      setLabelFrom(code);
      closeMenu();
    });
  });

  // Click outside (robust): close only if click isn't inside toggle or menu
  document.addEventListener('click', (ev) => {
    if (menu.hidden) return;
    const t = ev.target;
    const inside = menu.contains(t) || toggle.contains(t) || (wrap && wrap.contains(t));
    if (!inside) closeMenu();
  });

  // ESC to close
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeMenu();
  });

  // Initialize label from saved language
  setLabelFrom(getLang());

  console.log('[header-loader] loaded');
})();
