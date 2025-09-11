// /js/header-loader.js
(async function () {
  // 1) Inject header
  const headerSlot = document.getElementById('site-header');
  if (headerSlot) {
    try {
      const r = await fetch('/partials/header.html', { cache: 'no-cache' });
      headerSlot.innerHTML = await r.text();
    } catch (e) {
      console.warn('Header fetch failed:', e);
    }
  }

  // 2) Inject footer (optional)
  const footerSlot = document.getElementById('site-footer');
  if (footerSlot) {
    try {
      const rf = await fetch('/partials/footer.html', { cache: 'no-cache' });
      footerSlot.innerHTML = await rf.text();
    } catch (e) {
      console.warn('Footer fetch failed:', e);
    }
  }

  // 3) Wire up language dropdown (self-contained)
  function initLang() {
    const btn  = document.getElementById('mkLangBtn');
    const menu = document.getElementById('mkLangMenu');
    const flag = document.getElementById('mkLangCurrentFlag');
    const text = document.getElementById('mkLangCurrentText');
    if (!btn || !menu || !flag || !text) return;

    const map = {
      en: { flag: '🇬🇧', name: 'English' },
      fr: { flag: '🇫🇷', name: 'Français' },
      nl: { flag: '🇧🇪', name: 'Nederlands' },
      es: { flag: '🇪🇸', name: 'Español' },
    };

    const apply = (code) => {
      const item = map[code] || map.en;
      flag.textContent = item.flag;
      text.textContent = item.name;
      try { document.documentElement.setAttribute('lang', code); } catch {}
      window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
    };

    // restore saved (default en)
    const saved = localStorage.getItem('memoir.lang') || 'en';
    apply(saved);

    const open = () => { btn.setAttribute('aria-expanded', 'true'); menu.classList.add('open'); };
    const close = () => { btn.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); };
    const isOpen = () => menu.classList.contains('open');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen() ? close() : open();
    });

    // close on outside click / ESC
    document.addEventListener('click', (e) => {
      if (!isOpen()) return;
      if (!menu.contains(e.target) && e.target !== btn) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) close();
    });

    // pick a language
    menu.querySelectorAll('button[data-lang]').forEach((b) => {
      b.addEventListener('click', () => {
        const code = b.getAttribute('data-lang');
        localStorage.setItem('memoir.lang', code);
        apply(code);
        close();
      });
    });
  }
    // pick a language
    menu.querySelectorAll('button[data-lang]').forEach((b) => {
      b.addEventListener('click', () => {
        const code = b.getAttribute('data-lang');
        // Save + apply via global i18n (preferred)
        if (window.MEMOIR_I18N && typeof window.MEMOIR_I18N.setLang === 'function') {
          window.MEMOIR_I18N.setLang(code);
        } else {
          // Fallback: basic dispatch if lang.js hasn't loaded yet
          localStorage.setItem('memoir.lang', code);
          window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
        }
        close();
      });
    });
  
  // Give the browser a tick to paint the injected HTML, then init
  requestAnimationFrame(initLang);
})();
