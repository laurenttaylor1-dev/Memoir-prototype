// /js/header-loader.js
// Requires /js/lang.js to be loaded BEFORE this script on every page.

(async function attachHeaderFooter(){
  // 1) Inject header & footer
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');

  async function loadInto(el, url){
    if(!el) return;
    try{
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error(`Failed to load ${url}`);
      el.innerHTML = await r.text();
    }catch(e){
      console.error(e);
      // Minimal fallback to avoid a blank header/footer
      if(url.includes('header')) el.innerHTML = '<header class="site-header"><div class="wrap"><a class="brand" href="/landing.html">Memoir</a></div></header>';
      if(url.includes('footer')) el.innerHTML = '<footer class="site-footer"><div class="wrap">© Memoir</div></footer>';
    }
  }

  await Promise.all([
    loadInto(headerSlot, '/partials/header.html'),
    loadInto(footerSlot, '/partials/footer.html')
  ]);

  // 2) Wire language menu (after header HTML exists)
  const toggle = document.getElementById('lang-toggle');
  const menu   = document.getElementById('lang-dropdown');
  const items  = Array.from(document.querySelectorAll('.lang-item'));
  const flagEl = document.getElementById('lang-current-flag');
  const labelEl= document.getElementById('lang-current-label');

  function currentLang(){
    return (window.MEMOIR_I18N?.getLang?.() || localStorage.getItem('memoir_lang') || 'en');
  }

  function labelFor(code){
    switch(code){
      case 'en': return {flag:'🇬🇧', label:'English'};
      case 'fr': return {flag:'🇫🇷', label:'Français'};
      case 'nl': return {flag:'🇧🇪', label:'Nederlands'};
      case 'es': return {flag:'🇪🇸', label:'Español'};
      default:   return {flag:'🌐', label:code};
    }
  }

  function closeMenu(){
    if(!menu) return;
    menu.hidden = true;
    if(toggle) toggle.setAttribute('aria-expanded','false');
  }
  function openMenu(){
    if(!menu) return;
    menu.hidden = false;
    if(toggle) toggle.setAttribute('aria-expanded','true');
  }
  function toggleMenu(){
    if(!menu) return;
    menu.hidden ? openMenu() : closeMenu();
  }

  // Initialize current label
  const start = currentLang();
  const startInfo = labelFor(start);
  if(flagEl)  flagEl.textContent = startInfo.flag;
  if(labelEl) labelEl.textContent = startInfo.label;

  // Click: open/close
  if(toggle){
    toggle.addEventListener('click', (e)=>{
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Click on a language
  items.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const code = btn.getAttribute('data-lang');
      if(!code) return;

      // Update button label/flag
      const info = labelFor(code);
      if(flagEl)  flagEl.textContent = info.flag;
      if(labelEl) labelEl.textContent = info.label;

      // Persist + broadcast change (pages listen for 'memoir:lang')
      if(window.MEMOIR_I18N?.setLang){
        window.MEMOIR_I18N.setLang(code);
      }else{
        localStorage.setItem('memoir_lang', code);
        window.dispatchEvent(new CustomEvent('memoir:lang',{ detail:{ code } }));
      }

      closeMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e)=>{
    if(!menu || menu.hidden) return;
    const within = e.target.closest('#lang-menu');
    if(!within) closeMenu();
  });
  // Close on Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeMenu();
  });

  // 3) Re-apply current lang to the header texts (optional; header itself’s labels)
  // If you have translatable nav labels, you can update them here by reading
  // MEMOIR_I18N.strings[currentLang()] and assigning to #navHome, #navLogin, etc.
})();
