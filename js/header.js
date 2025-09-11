// /js/header.js
(function(){
  const API = {
    init(){
      const btn  = document.getElementById('mkLangBtn');
      const menu = document.getElementById('mkLangMenu');
      const flag = document.getElementById('mkLangCurrentFlag');
      const text = document.getElementById('mkLangCurrentText');
      if(!btn || !menu) return;

      // restore saved choice (default: en)
      const saved = (localStorage.getItem('memoir.lang') || 'en');
      API.applyLang(saved, {flag, text});

      // open/close
      const toggle = (open) => {
        const willOpen = (typeof open === 'boolean') ? open : menu.classList.contains('open') === false;
        btn.setAttribute('aria-expanded', String(willOpen));
        menu.classList.toggle('open', willOpen);
      };

      btn.addEventListener('click', (e)=>{ e.stopPropagation(); toggle(); });
      document.addEventListener('click', (e)=>{
        if(!menu.classList.contains('open')) return;
        // close when clicking outside
        if(!menu.contains(e.target) && e.target !== btn) toggle(false);
      });
      document.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape' && menu.classList.contains('open')) toggle(false);
      });

      // choose language
      menu.querySelectorAll('button[data-lang]').forEach(b=>{
        b.addEventListener('click', ()=>{
          const code = b.getAttribute('data-lang');
          localStorage.setItem('memoir.lang', code);
          API.applyLang(code, {flag, text});
          toggle(false);
          // broadcast change
          window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
        });
      });
    },

    applyLang(code, els){
      const map = {
        en: {flag:'🇬🇧', name:'English'},
        fr: {flag:'🇫🇷', name:'Français'},
        nl: {flag:'🇧🇪', name:'Nederlands'},
        es: {flag:'🇪🇸', name:'Español'},
      };
      const item = map[code] || map.en;
      if(els?.flag) els.flag.textContent = item.flag;
      if(els?.text) els.text.textContent = item.name;
      // also set document lang attribute for a11y/SEO
      try{ document.documentElement.setAttribute('lang', code); }catch{}
    }
  };

  // expose for loader
  window.MEMOIR_HEADER = API;
})();
