<script>
// Loads /partials/header.html and /partials/footer.html,
// wires the language dropdown, and keeps current flag/label in sync.

(async function () {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');

  async function loadInto(el, url) {
    if (!el) return;
    const r = await fetch(url, { cache: 'no-store' });
    const html = await r.text();
    el.innerHTML = html;
  }

  await Promise.all([
    loadInto(headerSlot, '/partials/header.html'),
    loadInto(footerSlot, '/partials/footer.html')
  ]);

  // After injection, wire up the language dropdown
  const toggle   = document.getElementById('lang-toggle');
  const dropdown = document.getElementById('lang-dropdown');
  const items    = dropdown ? dropdown.querySelectorAll('.lang-item') : [];

  // Update current flag/label
  function paintCurrentLang() {
    const code = window.MEMOIR_I18N?.getLang?.() || 'en';
    const map = { en: ['🇬🇧','English'], fr:['🇫🇷','Français'], nl:['🇧🇪','Nederlands'], es:['🇪🇸','Español'] };
    const [flag,label] = map[code] || map.en;
    const flagEl  = document.getElementById('lang-current-flag');
    const labelEl = document.getElementById('lang-current-label');
    if (flagEl)  flagEl.textContent  = flag;
    if (labelEl) labelEl.textContent = label;
  }

  function closeMenu(){ dropdown?.setAttribute('hidden',''); toggle?.setAttribute('aria-expanded','false'); }
  function openMenu(){ dropdown?.removeAttribute('hidden'); toggle?.setAttribute('aria-expanded','true'); }

  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
    const open = dropdown && dropdown.hasAttribute('hidden') === false;
    open ? closeMenu() : openMenu();
  });

  items.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-lang');
      if (code) {
        window.MEMOIR_I18N?.setLang?.(code); // this also reapplies translations + fires event
        paintCurrentLang();
        closeMenu();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown || !toggle) return;
    if (e.target === toggle || toggle.contains(e.target)) return;
    if (dropdown.contains(e.target)) return;
    closeMenu();
  });

  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // First paint of flag/label + apply translations once the header/footer exists
  paintCurrentLang();
  window.MEMOIR_I18N?.apply?.(window.MEMOIR_I18N?.getLang?.() || 'en');
})();
</script>
