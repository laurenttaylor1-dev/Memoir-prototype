// Loads header/footer partials, then wires the language dropdown reliably
(function () {
  async function inject(id, url) {
    const host = document.getElementById(id);
    if (!host) return;
    try {
      const r = await fetch(url, { cache: 'no-store' });
      host.innerHTML = await r.text();
    } catch (e) {
      console.warn('Failed to load partial:', url, e);
    }
  }

  function initHeader() {
    const i18n = window.MEMOIR_I18N || {};
    const getLang = i18n.getLang ? i18n.getLang.bind(i18n) : () => 'en';
    const setLang = i18n.setLang ? i18n.setLang.bind(i18n) : () => {};
    const MAP = {
      en: ['🇬🇧', 'English'],
      fr: ['🇫🇷', 'Français'],
      nl: ['🇧🇪', 'Nederlands'],
      es: ['🇪🇸', 'Español'],
    };

    const toggle = document.getElementById('lang-toggle');
    const menu   = document.getElementById('lang-dropdown');
    const flag   = document.getElementById('lang-current-flag');
    const label  = document.getElementById('lang-current-label');

    if (!toggle || !menu || !flag || !label) return; // header not present

    // Set current label/flag from persisted lang
    function reflectCurrent() {
      const code = getLang() || 'en';
      const [f, name] = MAP[code] || MAP.en;
      flag.textContent = f;
      label.textContent = name;
    }
    reflectCurrent();

    function open()  { menu.hidden = false; toggle.setAttribute('aria-expanded', 'true'); }
    function close() { menu.hidden = true;  toggle.setAttribute('aria-expanded', 'false'); }
    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      menu.hidden ? open() : close();
    }

    // Clean up previous handlers if this script runs twice
    toggle.replaceWith(toggle.cloneNode(true));
    menu.replaceWith(menu.cloneNode(true));

    // Re-grab nodes (they were replaced)
    const newToggle = document.getElementById('lang-toggle');
    const newMenu   = document.getElementById('lang-dropdown');

    newToggle.addEventListener('click', toggleMenu);

    // Delegate clicks inside the dropdown
    newMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-item');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const code = btn.dataset.lang || 'en';
      setLang(code);
      reflectCurrent();
      close();
    });

    // Close on outside click / Escape
    document.addEventListener('click', (e) => {
      const within = e.target.closest('#lang-menu');
      if (!within) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Keep flag/label in sync when language changes from elsewhere
    window.addEventListener('memoir:lang', reflectCurrent);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await inject('site-header', '/partials/header.html');
    await inject('site-footer', '/partials/footer.html');
    initHeader();
  });
})();
