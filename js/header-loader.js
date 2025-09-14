<script>
/* global window, document, fetch, MEMOIR_I18N */

(function(){
  const HEADER_URL = '/partials/header.html';
  const FOOTER_URL = '/partials/footer.html';

  async function inject(id, url) {
    const host = document.getElementById(id);
    if (!host) return null;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    host.innerHTML = await res.text();
    // After injection, translate the inserted chunk
    if (window.MEMOIR_I18N) window.MEMOIR_I18N.applyAll(host);
    return host;
  }

  function updateLangButton(lang) {
    const flagEl  = document.getElementById('lang-current-flag');
    const labelEl = document.getElementById('lang-current-label');
    const map = {
      en: { f: '🇬🇧', l: 'English'   },
      fr: { f: '🇫🇷', l: 'Français'  },
      nl: { f: '🇧🇪', l: 'Nederlands'},
      es: { f: '🇪🇸', l: 'Español'   },
    };
    const cur = map[lang] || map.en;
    if (flagEl)  flagEl.textContent  = cur.f;
    if (labelEl) labelEl.textContent = cur.l;
  }

  function wireHeaderInteractions(root) {
    const toggle = root.querySelector('#lang-toggle');
    const menu   = root.querySelector('#lang-dropdown');
    if (!toggle || !menu) return;

    // Open/close
    toggle.addEventListener('click', (e)=>{
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      toggle.setAttribute('aria-expanded', String(!menu.hidden));
    });

    // Select language
    root.querySelectorAll('.lang-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const lang = btn.getAttribute('data-lang') || 'en';
        window.MEMOIR_I18N?.setLang(lang);
        updateLangButton(lang);
        menu.hidden = true;
        toggle.setAttribute('aria-expanded','false');
      });
    });

    // Click outside closes
    document.addEventListener('click', ()=>{
      if (!menu.hidden) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded','false');
      }
    });

    // Initialize from stored language
    updateLangButton(window.MEMOIR_I18N?.getLang?.() || 'en');
  }

  // Inject header & footer on DOM ready
  document.addEventListener('DOMContentLoaded', async ()=>{
    const header = await inject('site-header', HEADER_URL);
    if (header) wireHeaderInteractions(header);

    await inject('site-footer', FOOTER_URL);
  });

  // If language changes later, re-translate the injected partials too
  window.addEventListener('memoir:lang', ()=>{
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');
    window.MEMOIR_I18N?.applyAll(header || document);
    window.MEMOIR_I18N?.applyAll(footer || document);
  });
})();
</script>
