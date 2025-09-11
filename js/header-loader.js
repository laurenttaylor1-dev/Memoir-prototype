<script>
/* header-loader.js — compatible with your partials/header.html IDs */
(async function () {
  async function inject(id, url) {
    const slot = document.getElementById(id);
    if (!slot) return { ok:false };
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch ' + url + ' failed: ' + res.status);
      slot.innerHTML = await res.text();
      return { ok:true };
    } catch (e) {
      // Minimal fallback header to keep site usable
      if (id === 'site-header') {
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
    <nav class="nav">
      <a id="navHome"   class="pill" href="/landing.html">Home</a>
      <a id="navLogin"  class="pill" href="/login.html">Login</a>
      <a id="navRecord" class="pill" href="/record.html">Record</a>
      <a id="navStories"class="pill" href="/stories.html">My Stories</a>
      <div class="lang" id="lang-menu">
        <button id="lang-toggle" class="pill lang-toggle" type="button" aria-haspopup="true" aria-expanded="false">
          <span id="lang-current-flag">🇬🇧</span>
          <span id="lang-current-label">English</span>
          <svg class="chev" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
            <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
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
      console.warn('Header inject failed:', e);
      return { ok:false, error:e };
    }
  }

  // Inject partials
  await inject('site-header', '/partials/header.html');
  await inject('site-footer', '/partials/footer.html');

  // ---- Wire language dropdown + header labels ----
  function applyHeaderLang(code){
    const t = (window.MEMOIR_I18N?.strings?.[code]) || window.MEMOIR_I18N.strings.en;
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

    // nav labels
    set('navHome',    t.nav_home);
    set('navLogin',   t.nav_login);
    set('navRecord',  t.nav_record);
    set('navStories', t.nav_stories);

    // current language flag/label
    const flagMap = { en:'🇬🇧', fr:'🇫🇷', nl:'🇧🇪', es:'🇪🇸' };
    const labelMap= { en:'English', fr:'Français', nl:'Nederlands', es:'Español' };
    const flagEl  = document.getElementById('lang-current-flag');
    const labelEl = document.getElementById('lang-current-label');
    if (flagEl)  flagEl.textContent  = flagMap[code]  || '🇬🇧';
    if (labelEl) labelEl.textContent = labelMap[code] || 'English';
  }

  function bindDropdown(){
    const btn   = document.getElementById('lang-toggle');
    const menu  = document.getElementById('lang-dropdown');
    if (!btn || !menu) return;

    const open = ()=>{ menu.hidden = false; btn.setAttribute('aria-expanded','true'); };
    const close= ()=>{ menu.hidden = true;  btn.setAttribute('aria-expanded','false'); };

    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      menu.hidden ? open() : close();
    });
    document.addEventListener('click', (e)=>{
      if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) close();
    });

    menu.querySelectorAll('.lang-item[data-lang]').forEach(item=>{
      item.addEventListener('click', ()=>{
        const code = item.getAttribute('data-lang');
        window.MEMOIR_I18N?.setLang(code);
        close(); // close immediately after selection
      });
    });
  }

  // initial render + bindings
  const start = window.MEMOIR_I18N?.getLang?.() || 'en';
  applyHeaderLang(start);
  bindDropdown();

  // react to global language bus
  window.addEventListener('memoir:lang', e=>applyHeaderLang(e.detail.code));
})();
</script>
