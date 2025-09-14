// Inject header/footer partials and wire the language dropdown (single-run, robust)
(function(){
  const STATE = (window.__memoirHeaderState = window.__memoirHeaderState || {});

  async function inject(id, url){
    const host = document.getElementById(id);
    if(!host) return null;
    const r = await fetch(url, { cache: 'no-store' });
    const html = await r.text();
    host.innerHTML = html;
    return host;
  }

  function bindLangMenu(){
    if (STATE.bound) return; // prevent double binding on navigations
    STATE.bound = true;

    const i18n = window.MEMOIR_I18N;
    const getLang = i18n?.getLang || (()=>'en');
    const setLang = i18n?.setLang || (()=>{});
    const MAP = {
      en: ['🇬🇧', 'English'],
      fr: ['🇫🇷', 'Français'],
      nl: ['🇧🇪', 'Nederlands'],
      es: ['🇪🇸', 'Español']
    };

    const menuWrap = document.getElementById('lang-menu');
    const toggle   = document.getElementById('lang-toggle');
    const dropdown = document.getElementById('lang-dropdown');
    const flag     = document.getElementById('lang-current-flag');
    const label    = document.getElementById('lang-current-label');

    if(!menuWrap || !toggle || !dropdown || !flag || !label) return; // header not present

    function reflect(){
      const code = getLang();
      const [f, name] = MAP[code] || MAP.en;
      flag.textContent = f;
      label.textContent = name;
    }
    reflect();

    function open(){ dropdown.hidden = false; toggle.setAttribute('aria-expanded','true'); }
    function close(){ dropdown.hidden = true; toggle.setAttribute('aria-expanded','false'); }

    toggle.addEventListener('click', (e)=>{
      e.preventDefault(); e.stopPropagation();
      dropdown.hidden ? open() : close();
    });

    dropdown.addEventListener('click', (e)=>{
      const btn = e.target.closest('.lang-item');
      if(!btn) return;
      const code = btn.dataset.lang || 'en';
      setLang(code);
      reflect();
      close();
    });

    document.addEventListener('click', (e)=>{
      if(!e.target.closest('#lang-menu')) close();
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') close();
    });

    // Re-reflect when something else changes the language
    window.addEventListener('memoir:lang', reflect);
  }

  async function boot(){
    // 1) inject partials
    await inject('site-header', '/partials/header.html');
    await inject('site-footer', '/partials/footer.html');

    // 2) translate newly inserted markup
    if (window.MEMOIR_I18N?.applyAll) {
      window.MEMOIR_I18N.applyAll(document);
    }

    // 3) bind the dropdown once
    bindLangMenu();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
