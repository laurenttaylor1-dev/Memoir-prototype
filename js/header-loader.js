<script>
(function(){
  const HEADER_SLOT = 'site-header';
  const FOOTER_SLOT = 'site-footer';

  async function fetchText(url){
    const r = await fetch(url, { cache:'no-store' });
    if(!r.ok) throw new Error(url+' '+r.status);
    return await r.text();
  }
  function setHTML(id, html){
    const el = document.getElementById(id);
    if(el) el.innerHTML = html;
  }

  function fallbackHeader(){
    return `
<header style="position:sticky;top:0;z-index:50;background:#fffaf5;border-bottom:1px solid rgba(0,0,0,.08)">
  <div style="max-width:1200px;margin:0 auto;padding:10px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
    <a href="/landing.html" style="display:flex;gap:10px;align-items:center;text-decoration:none;color:#3b2f2a;font-weight:700">
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
</header>`;
  }

  function initHeaderBehaviors(){
    // Close language dropdown after selecting & when clicking outside
    const btn  = document.querySelector('[data-lang-btn],[data-lang-trigger]');
    const menu = document.querySelector('[data-lang-menu]');
    if (!btn || !menu) return;

    function close(){
      menu.classList.add('hidden');
      menu.setAttribute('hidden','');
      btn.setAttribute('aria-expanded','false');
      document.removeEventListener('click', onDoc);
    }
    function onDoc(e){
      if (!menu.contains(e.target) && !btn.contains(e.target)) close();
    }
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      menu.classList.toggle('hidden');
      if (menu.classList.contains('hidden')) {
        menu.setAttribute('hidden','');
        btn.setAttribute('aria-expanded','false');
        document.removeEventListener('click', onDoc);
      } else {
        menu.removeAttribute('hidden');
        btn.setAttribute('aria-expanded','true');
        setTimeout(()=>document.addEventListener('click', onDoc), 0);
      }
    });
    menu.addEventListener('click', (e)=>{
      const opt = e.target.closest('[data-set-lang]');
      if (opt) close();
    });
  }

  async function loadHeader(){
    try {
      setHTML(HEADER_SLOT, await fetchText('/partials/header.html'));
    } catch(e1){
      try {
        setHTML(HEADER_SLOT, await fetchText('/header.html'));
      } catch(e2){
        setHTML(HEADER_SLOT, fallbackHeader());
        console.warn('Header partial failed, used fallback', e1, e2);
      }
    }
    if (typeof window.MEMOIR_headerInit === 'function') {
      try { window.MEMOIR_headerInit(); } catch(_) {}
    }
    initHeaderBehaviors();
    window.dispatchEvent(new CustomEvent('memoir:header:loaded'));
  }

  async function loadFooter(){
    try {
      setHTML(FOOTER_SLOT, await fetchText('/partials/footer.html'));
    } catch(e1){
      try {
        setHTML(FOOTER_SLOT, await fetchText('/footer.html'));
      } catch(e2){
        // no-op fallback
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
