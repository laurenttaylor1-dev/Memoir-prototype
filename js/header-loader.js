/* Header loader — fetches /partials/header.html, wires language menu, works with lang.js */
(function(){
  const SLOT_ID = 'site-header';
  const PARTIAL = '/partials/header.html';

  function waitI18N(cb){
    if (window.MEMOIR_I18N) return cb();
    const h = setInterval(()=>{ if(window.MEMOIR_I18N){ clearInterval(h); cb(); } }, 25);
    setTimeout(()=>clearInterval(h), 5000);
  }

  async function load(){
    const slot = document.getElementById(SLOT_ID);
    if(!slot) return;

    try{
      const res = await fetch(PARTIAL + '?v=15', { cache:'no-store' });
      if(!res.ok) throw new Error('fetch_failed');
      const html = await res.text();
      if (html.trim().startsWith('<!DOCTYPE') || html.trim().startsWith('<html')) {
        // Guard: wrong asset (served HTML)
        throw new Error('got_html');
      }
      slot.innerHTML = html;
      console.info('[header-loader] loaded');
    }catch(e){
      console.warn('[header-loader] failed, using fallback', e);
      slot.innerHTML = `
        <header class="site-header">
          <div class="wrap">
            <a class="brand" href="/landing.html"><span class="logo"></span><span class="brand-text"><strong>MEMOIR APP</strong><small>Preserve your memories forever</small></span></a>
            <nav class="nav">
              <a class="pill" id="navHome" href="/landing.html">Home</a>
              <a class="pill" id="navLogin" href="/login.html">Login</a>
              <a class="pill" id="navRecord" href="/record.html">Record</a>
              <a class="pill" id="navStories" href="/stories.html">My Stories</a>
              <div class="lang" id="lang-menu">
                <button id="lang-toggle" class="pill lang-toggle" type="button" aria-haspopup="true" aria-expanded="false">
                  <span id="lang-current-flag">🇬🇧</span><span id="lang-current-label">English</span>
                  <svg class="chev" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <div id="lang-dropdown" class="lang-menu" role="menu" hidden>
                  <button class="lang-item" data-lang="en" role="menuitem">🇬🇧 English</button>
                  <button class="lang-item" data-lang="fr" role="menuitem">🇫🇷 Français</button>
                  <button class="lang-item" data-lang="nl" role="menuitem">🇧🇪 Nederlands</button>
                  <button class="lang-item" data-lang="es" role="menuitem">🇪🇸 Español</button>
                </div>
              </div>
            </nav>
          </div>
        </header>`;
    }

    // After header HTML is in place, localize + wire language menu
    waitI18N(()=>{
      // Translate any i18n spans inside header.html
      try { window.MEMOIR_I18N.apply(document.getElementById(SLOT_ID)); } catch {}

      // Sync nav labels (if header.html uses plain text IDs)
      const t = window.MEMOIR_I18N.t;
      const idMap = { navHome:'navHome', navLogin:'navLogin', navRecord:'navRecord', navStories:'navStories' };
      Object.entries(idMap).forEach(([id,key])=>{
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
      });

      wireLangMenu();
      // Also update current label when language changes elsewhere
      window.addEventListener('memoir:lang', syncCurrentLang);
      syncCurrentLang();
    });
  }

  function syncCurrentLang(){
    const code = window.MEMOIR_I18N.getLang();
    const label = {
      en: window.MEMOIR_I18N.t('langEnglish'),
      fr: window.MEMOIR_I18N.t('langFrench'),
      nl: window.MEMOIR_I18N.t('langDutch'),
      es: window.MEMOIR_I18N.t('langSpanish'),
    }[code] || code.toUpperCase();
    const flag = { en:'🇬🇧', fr:'🇫🇷', nl:'🇧🇪', es:'🇪🇸' }[code] || '🏳️';
    const lbl = document.getElementById('lang-current-label');
    const flg = document.getElementById('lang-current-flag');
    if(lbl) lbl.textContent = label;
    if(flg) flg.textContent = flag;
  }

  function wireLangMenu(){
    const toggle = document.getElementById('lang-toggle');
    const menu = document.getElementById('lang-dropdown');
    if(!toggle || !menu) return;

    function open(){ menu.hidden = false; toggle.setAttribute('aria-expanded','true'); }
    function close(){ menu.hidden = true; toggle.setAttribute('aria-expanded','false'); }
    function isOpen(){ return !menu.hidden; }

    toggle.addEventListener('click', (e)=>{
      e.stopPropagation();
      isOpen() ? close() : open();
    });

    menu.querySelectorAll('.lang-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const code = btn.getAttribute('data-lang');
        window.MEMOIR_I18N.setLang(code);
        close();
      });
    });

    document.addEventListener('click', (e)=>{
      if(isOpen() && !menu.contains(e.target) && e.target !== toggle) close();
    });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
  }

  document.addEventListener('DOMContentLoaded', load);
})();
