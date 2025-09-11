<!-- /js/header-loader.js -->
<script>
(function(){
  const SLOT_ID = 'site-header';
  const FOOTER_SLOT_ID = 'site-footer';

  async function fetchText(url){
    const r = await fetch(url, {cache:'no-store'});
    if(!r.ok) throw new Error(url + ' ' + r.status);
    return await r.text();
  }

  function insertHTML(slotId, html){
    const el = document.getElementById(slotId);
    if(el) el.innerHTML = html;
  }

  function fallbackHeaderHTML(){
    return `
      <header style="position:sticky;top:0;z-index:50;background:#fffaf5;border-bottom:1px solid rgba(0,0,0,.08)">
        <div style="max-width:1200px;margin:0 auto;padding:10px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <a href="/" style="display:flex;gap:10px;align-items:center;text-decoration:none;color:#3b2f2a;font-weight:700">
            <span style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#8c5a3c,#b17d55);display:inline-block"></span>
            MEMOIR APP
          </a>
          <nav style="display:flex;gap:8px;flex-wrap:wrap;margin-left:auto">
            <a href="/landing.html" class="btn">Home</a>
            <a href="/login.html" class="btn">Login</a>
            <a href="/record.html" class="btn">Record</a>
            <a href="/stories.html" class="btn">My Stories</a>
          </nav>
        </div>
      </header>
    `;
  }

  function initHeaderBehaviors(){
    // If your header.html provides a global init, call it
    if (typeof window.MEMOIR_headerInit === 'function') {
      try { window.MEMOIR_headerInit(); } catch(_) {}
    }

    // Make sure language dropdown closes after selection
    const menu = document.querySelector('[data-lang-menu]');
    const trigger = document.querySelector('[data-lang-trigger]');
    if (menu && trigger) {
      menu.querySelectorAll('button,[data-lang-option]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          menu.setAttribute('hidden','');
          trigger.setAttribute('aria-expanded','false');
        });
      });
      document.addEventListener('click', (e)=>{
        if (!menu.contains(e.target) && !trigger.contains(e.target)) {
          menu.setAttribute('hidden','');
          trigger.setAttribute('aria-expanded','false');
        }
      });
    }
  }

  async function loadHeader(){
    const slot = document.getElementById(SLOT_ID);
    if(!slot) return;

    try{
      // 1) preferred
      insertHTML(SLOT_ID, await fetchText('/partials/header.html'));
    }catch(e1){
      try{
        // 2) fallback location
        insertHTML(SLOT_ID, await fetchText('/header.html'));
      }catch(e2){
        // 3) guaranteed fallback
        insertHTML(SLOT_ID, fallbackHeaderHTML());
        console.warn('Header partial failed, using fallback', e1, e2);
      }
    }
    initHeaderBehaviors();
    window.dispatchEvent(new CustomEvent('memoir:header:loaded'));
  }

  async function loadFooter(){
    const slot = document.getElementById(FOOTER_SLOT_ID);
    if(!slot) return;

    try{
      insertHTML(FOOTER_SLOT_ID, await fetchText('/partials/footer.html'));
    }catch(e1){
      try{
        insertHTML(FOOTER_SLOT_ID, await fetchText('/footer.html'));
      }catch(e2){
        // silent fallback (no footer)
        console.warn('Footer partial failed', e1, e2);
      }
    }
    window.dispatchEvent(new CustomEvent('memoir:footer:loaded'));
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    loadHeader();
    loadFooter();
  });
})();
</script>
