<script>
/* header-loader.js — loads partials + wires language dropdown */
(async function () {
  async function inject(id, url) {
    const slot = document.getElementById(id);
    if (!slot) return;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      slot.innerHTML = await res.text();
    } catch {
      // minimal fallback to keep layout usable
      if (id === 'site-header') {
        slot.innerHTML = `
          <header class="site-header-fallback">
            <a href="/landing.html" class="brand">MEMOIR APP</a>
            <nav class="nav">
              <a id="hHome" href="/landing.html"></a>
              <a id="hLogin" href="/login.html"></a>
              <a id="hRecord" href="/record.html"></a>
              <a id="hStories" href="/stories.html"></a>
              <button id="langBtn" class="lang-btn">English ▾</button>
              <div id="langMenu" class="lang-menu hidden">
                <button data-code="en">🇬🇧 English</button>
                <button data-code="fr">🇫🇷 Français</button>
                <button data-code="nl">🇧🇪 Nederlands</button>
                <button data-code="es">🇪🇸 Español</button>
              </div>
            </nav>
          </header>`;
      }
    }
  }

  await inject('site-header', '/partials/header.html');
  await inject('site-footer', '/partials/footer.html');

  // ---- language wiring (works for both real partial and fallback) ----
  function applyHeaderLang(code){
    const t = (window.MEMOIR_I18N?.strings?.[code]) || window.MEMOIR_I18N.strings.en;
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set('hHome', t.nav_home); set('hLogin', t.nav_login);
    set('hRecord', t.nav_record); set('hStories', t.nav_stories);
    const btn = document.getElementById('langBtn');
    if (btn) btn.textContent = (code==='fr'?'Français':code==='nl'?'Nederlands':code==='es'?'Español':'English') + ' ▾';
  }

  function bindDropdown(){
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langMenu');
    if (!btn || !menu) return;
    const open = ()=> menu.classList.remove('hidden');
    const close= ()=> menu.classList.add('hidden');

    btn.addEventListener('click', (e)=>{ e.stopPropagation(); menu.classList.toggle('hidden'); });
    document.addEventListener('click', close);
    menu.querySelectorAll('[data-code]').forEach(b=>{
      b.addEventListener('click', (e)=>{
        const code = b.getAttribute('data-code');
        window.MEMOIR_I18N?.setLang(code);
        close();
      });
    });
  }

  // initial render + bindings
  const start = window.MEMOIR_I18N?.getLang?.() || 'en';
  applyHeaderLang(start);
  bindDropdown();

  // react to bus
  window.addEventListener('memoir:lang', e=>applyHeaderLang(e.detail.code));
})();
</script>
