// /js/header-loader.js
(async function(){
  const slot = document.getElementById('site-header');
  try{
    const r = await fetch('/partials/header.html', { cache:'no-cache' });
    const html = await r.text();
    if(slot) slot.innerHTML = html;
  }catch(e){
    console.warn('Header fetch failed', e);
  }finally{
    // init behavior (lang dropdown etc.)
    if(window.MEMOIR_HEADER?.init) window.MEMOIR_HEADER.init();
  }

  // footer (optional, if you use it)
  const fslot = document.getElementById('site-footer');
  if(fslot){
    try{
      const rf = await fetch('/partials/footer.html', { cache:'no-cache' });
      fslot.innerHTML = await rf.text();
    }catch(e){ console.warn('Footer fetch failed', e); }
  }
})();
