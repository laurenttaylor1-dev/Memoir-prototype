// Loads /partials/header.html into #site-header and wires the language dropdown
(function () {
  async function loadHeader() {
    const slot = document.getElementById('site-header');
    if (!slot) return;

    try {
      const res = await fetch('/partials/header.html', { cache: 'no-store' });
      const html = await res.text();
      slot.innerHTML = html;
      wireHeader(slot);
    } catch (e) {
      console.error('Header load failed:', e);
    }
  }

  function wireHeader(root) {
    // --- Language dropdown toggle ---
    const wrap   = root.querySelector('#lang-menu');
    const button = root.querySelector('#lang-toggle');
    const menu   = root.querySelector('#lang-dropdown');

    if (!wrap || !button || !menu) return;

    const open = () => {
      wrap.classList.add('open');
      menu.hidden = false;
      button.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      wrap.classList.remove('open');
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    };
    const toggle = (e) => {
      e.stopPropagation();
      if (wrap.classList.contains('open')) close(); else open();
    };

    button.addEventListener('click', toggle);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) close();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Persisted language → show current flag/label
    const current = (window.MEMOIR_I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');
    setLangVisual(current);

    // Handle picks
    menu.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-lang');
        // Set + apply using the i18n helper if present
        if (window.MEMOIR_I18N?.setLang) {
          window.MEMOIR_I18N.setLang(code);
        } else {
          localStorage.setItem('memoir.lang', code);
          window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
        }
        setLangVisual(code);
        close();
      });
    });

    // Update button label/flag
    function setLangVisual(code) {
      const flagEl = root.querySelector('#lang-current-flag');
      const labelEl = root.querySelector('#lang-current-label');
      const MAP = { en: ['🇬🇧','English'], fr: ['🇫🇷','Français'], nl: ['🇧🇪','Nederlands'], es: ['🇪🇸','Español'] };
      const [flag, label] = MAP[code] || MAP.en;
      if (flagEl) flagEl.textContent = flag;
      if (labelEl) labelEl.textContent = label;
    }

    // If i18n changes elsewhere, keep the chip in sync
    window.addEventListener('memoir:lang', (e) => setLangVisual(e.detail.code));
  }

  document.addEventListener('DOMContentLoaded', loadHeader);
})();
