<script>
// Robust header/footer loader with diagnostics and a safe fallback.
(async function () {
  const HREF_HEADER = '/partials/header.html';
  const HREF_FOOTER = '/partials/footer.html';

  const slotHeader = document.getElementById('site-header');
  const slotFooter = document.getElementById('site-footer');

  async function loadHTML(targetEl, url, fallbackHTML) {
    if (!targetEl) return;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      if (!html || !html.trim()) throw new Error('Empty file');
      targetEl.innerHTML = html;
    } catch (err) {
      console.warn(`[header-loader] Failed to load ${url}:`, err);
      targetEl.innerHTML = fallbackHTML || '';
    }
  }

  // Minimal safe fallbacks so the app isn’t blank if fetch fails
  const fallbackHeader = `
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="/landing.html">
          <span class="logo"></span>
          <span class="brand-text"><strong>MEMOIR APP</strong><small>Preserve your memories forever</small></span>
        </a>
        <nav class="nav">
          <a class="pill" href="/landing.html" data-i18n="navHome">Home</a>
          <a class="pill" href="/login.html" data-i18n="navLogin">Login</a>
          <a class="pill" href="/record.html" data-i18n="navRecord">Record</a>
          <a class="pill" href="/stories.html" data-i18n="navStories">My Stories</a>
          <div class="lang">
            <button id="lang-toggle" class="pill lang-toggle" type="button">
              <span id="lang-current-flag">🇬🇧</span>
              <span id="lang-current-label">English</span>
              <svg class="chev" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div id="lang-dropdown" class="lang-menu" role="menu" hidden>
              <button class="lang-item" data-lang="en">🇬🇧 English</button>
              <button class="lang-item" data-lang="fr">🇫🇷 Français</button>
              <button class="lang-item" data-lang="nl">🇧🇪 Nederlands</button>
              <button class="lang-item" data-lang="es">🇪🇸 Español</button>
            </div>
          </div>
        </nav>
      </div>
    </header>`;
  const fallbackFooter = `
    <footer class="site-footer">
      <div class="site-footer-wrap">
        <div class="foot-grid">
          <div>
            <strong>Memoir</strong>
            <p data-i18n="footerAbout">Memoir is a gentle way to capture life stories and keep them safe for your family.</p>
          </div>
          <div></div>
          <div style="text-align:right">
            <a href="/legal.html" class="pill" data-i18n="footerLegal">Legal & Policies</a>
          </div>
        </div>
      </div>
    </footer>`;

  await Promise.all([
    loadHTML(slotHeader, HREF_HEADER, fallbackHeader),
    loadHTML(slotFooter, HREF_FOOTER, fallbackFooter),
  ]);

  // After injection, wire language dropdown
  const toggle   = document.getElementById('lang-toggle');
  const dropdown = document.getElementById('lang-dropdown');
  const items    = dropdown ? dropdown.querySelectorAll('.lang-item') : [];

  function paintCurrentLang() {
    const code = window.MEMOIR_I18N?.getLang?.() || 'en';
    const map = { en:['🇬🇧','English'], fr:['🇫🇷','Français'], nl:['🇧🇪','Nederlands'], es:['🇪🇸','Español'] };
    const [flag,label] = map[code] || map.en;
    const flagEl  = document.getElementById('lang-current-flag');
    const labelEl = document.getElementById('lang-current-label');
    if (flagEl)  flagEl.textContent  = flag;
    if (labelEl) labelEl.textContent = label;
  }
  function closeMenu(){ dropdown?.setAttribute('hidden',''); toggle?.setAttribute('aria-expanded','false'); }
  function openMenu(){ dropdown?.removeAttribute('hidden'); toggle?.setAttribute('aria-expanded','true'); }
  toggle?.addEventListener('click', (e)=>{ e.preventDefault(); (dropdown?.hasAttribute('hidden')===false?closeMenu:openMenu)(); });
  items.forEach(btn => btn.addEventListener('click', () => {
    const code = btn.getAttribute('data-lang');
    if (code) {
      window.MEMOIR_I18N?.setLang?.(code);
      paintCurrentLang();
      closeMenu();
    }
  }));
  document.addEventListener('click', (e) => {
    if (!dropdown || !toggle) return;
    if (e.target === toggle || toggle.contains(e.target) || dropdown.contains(e.target)) return;
    closeMenu();
  });
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });

  paintCurrentLang();
  window.MEMOIR_I18N?.apply?.(window.MEMOIR_I18N?.getLang?.() || 'en');
})();
</script>
