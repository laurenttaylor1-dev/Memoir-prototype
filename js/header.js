// /js/header.js
(function () {
  const root = document;
  const btn  = root.getElementById('mkLangBtn');
  const menu = root.getElementById('mkLangMenu');
  const label = root.getElementById('mkLangLabel');

  if (!btn || !menu) return;

  const I18N = window.MEMOIR_I18N;

  // --- helpers
  const open = () => {
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    // move focus for keyboard users
    setTimeout(() => menu.focus(), 0);
  };
  const close = () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };
  const toggle = () => (menu.classList.contains('open') ? close() : open());

  // click the button
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });

  // choose a language
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-lang]');
    if (!b) return;
    const code = b.getAttribute('data-lang');
    I18N?.setLang?.(code);               // persist + dispatch global event
    // reflect in the button
    const map = { en: '🇬🇧 English', fr: '🇫🇷 Français', nl: '🇧🇪 Nederlands', es: '🇪🇸 Español' };
    label.textContent = (map[code] || 'English').replace(/^[^\s]+\s/, '');
    btn.querySelector('.mk-flag').textContent = (map[code] || '🇬🇧 English').split(' ')[0];

    close();
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('open')) return;
    if (e.target.closest('.mk-lang')) return;
    close();
  });

  // close on ESC / focusout
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  menu.addEventListener('blur', (e) => {
    // if focus leaves the menu entirely
    setTimeout(() => {
      if (!document.activeElement || !menu.contains(document.activeElement)) close();
    }, 0);
  });

  // initialize label from saved lang
  const code = I18N?.getLang?.() || 'en';
  const map = { en: '🇬🇧 English', fr: '🇫🇷 Français', nl: '🇧🇪 Nederlands', es: '🇪🇸 Español' };
  label.textContent = (map[code] || 'English').replace(/^[^\s]+\s/, '');
  btn.querySelector('.mk-flag').textContent = (map[code] || '🇬🇧 English').split(' ')[0];
})();
