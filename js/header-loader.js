// /js/header-loader.js
(async function () {
  const slot = document.getElementById('site-header');
  if (!slot) return;

  try {
    const res = await fetch('/partials/header.html', { cache: 'no-store' });
    if (!res.ok) throw new Error('header fetch failed');
    slot.innerHTML = await res.text();
  } catch (e) {
    console.warn('[header-loader] failed, injecting fallback', e);
    slot.innerHTML = '<header class="site-header"><div class="wrap"><a class="brand" href="/landing.html"><span class="logo"></span><span class="brand-text"><strong>MEMOIR APP</strong><small>Preserve your memories forever</small></span></a></div></header>';
  }

  // === Wire language dropdown ===
  const toggle   = document.getElementById('lang-toggle');
  const menu     = document.getElementById('lang-dropdown');
  const items    = menu ? menu.querySelectorAll('.lang-item') : [];

  const I18N = window.MEMOIR_I18N;
  const getLang = () => (I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');

  function closeMenu() {
    if (menu) {
      menu.hidden = true;
      toggle?.setAttribute('aria-expanded', 'false');
    }
  }
  function openMenu() {
    if (menu) {
      menu.hidden = false;
      toggle?.setAttribute('aria-expanded', 'true');
    }
  }

  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!menu) return;
    menu.hidden ? openMenu() : closeMenu();
  });

  items.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.lang || 'en';
      // Save + broadcast via lang.js
      try {
        localStorage.setItem('memoir.lang', code);
        // If lang.js is present, let it handle DOM updates
        window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
        I18N?.apply?.(code);
      } catch {}
      // Update current label/flag in button
      const label = btn.textContent.trim();
      const flag  = label.split(' ')[0];
      const name  = label.replace(flag, '').trim();
      const flagEl  = document.getElementById('lang-current-flag');
      const nameEl  = document.getElementById('lang-current-label');
      if (flagEl) flagEl.textContent = flag;
      if (nameEl) nameEl.textContent = name;
      closeMenu();
    });
  });

  // Close on outside click / ESC
  document.addEventListener('click', (ev) => {
    if (!menu || menu.hidden) return;
    const within = ev.target.closest?.('#lang-menu');
    if (!within) closeMenu();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeMenu();
  });

  // Initialize current label/flag from saved language
  (function initLabel() {
    const code = getLang();
    const map = { en:'🇬🇧 English', fr:'🇫🇷 Français', nl:'🇧🇪 Nederlands', es:'🇪🇸 Español' };
    const label = map[code] || map.en;
    const [flag, ...rest] = label.split(' ');
    const flagEl = document.getElementById('lang-current-flag');
    const nameEl = document.getElementById('lang-current-label');
    if (flagEl) flagEl.textContent = flag;
    if (nameEl) nameEl.textContent = rest.join(' ');
  })();

  console.log('[header-loader] loaded');
})();
