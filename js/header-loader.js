// js/header-loader.js
// Loads /partials/header.html and /partials/footer.html, wires language menu

(async function () {
  const headerHost = document.getElementById('site-header');
  const footerHost = document.getElementById('site-footer');

  async function inject(target, url) {
    if (!target) return null;
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error(`${url} failed`);
      const html = await r.text();
      target.innerHTML = html;
      return target;
    } catch (e) {
      console.warn('Partial load failed:', url, e);
      return null;
    }
  }

  // Inject header/footer
  await inject(headerHost, '/partials/header.html');
  await inject(footerHost, '/partials/footer.html');

  // --- After header is in the DOM, wire language control
  // Elements in header.html:
  //   .lang-button (toggle)   #memoir-lang-menu (menu)
  //   [data-lang="en|fr|es|nl"] buttons inside menu
  const btn = document.querySelector('.lang-button');
  const menu = document.getElementById('memoir-lang-menu');

  function closeMenu() {
    menu?.classList.remove('open');
    btn?.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    menu?.classList.add('open');
    btn?.setAttribute('aria-expanded', 'true');
  }

  // Toggle click
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    menu?.classList.toggle('open');
    btn.setAttribute(
      'aria-expanded',
      menu.classList.contains('open') ? 'true' : 'false'
    );
  });

  // Click outside closes
  document.addEventListener('click', (e) => {
    if (!menu) return;
    if (!menu.contains(e.target) && !btn?.contains(e.target)) closeMenu();
  });

  // Select a language
  menu?.querySelectorAll('[data-lang]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const code = el.getAttribute('data-lang');
      if (window.MEMOIR_I18N?.setLang) {
        window.MEMOIR_I18N.setLang(code);
      }
      // Visually mark current
      menu.querySelectorAll('[data-lang]').forEach((a) =>
        a.classList.toggle('active', a === el)
      );
      // Reflect on button label (if you show current language there)
      const label = el.textContent.trim();
      const current = document.querySelector('.lang-button .current-lang');
      if (current) current.textContent = label;
      closeMenu();
    });
  });

  // Initialize button label + active state from stored language
  function paintCurrentLang() {
    const code = window.MEMOIR_I18N?.getLang?.() || 'en';
    const item = menu?.querySelector(`[data-lang="${code}"]`);
    if (item) {
      menu.querySelectorAll('[data-lang]').forEach((a) =>
        a.classList.toggle('active', a === item)
      );
      const current = document.querySelector('.lang-button .current-lang');
      if (current) current.textContent = item.textContent.trim();
    }
  }
  paintCurrentLang();

  // If another page module changes language, mirror in header.
  window.addEventListener('memoir:lang', paintCurrentLang);
})();
