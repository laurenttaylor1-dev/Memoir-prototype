// Loads /partials/header.html into #site-header and wires the language menu
(async () => {
  const SLOT_ID = 'site-header';
  const PARTIAL = '/partials/header.html';

  function log(msg){ try{console.debug('[header-loader]', msg);}catch{} }

  // Ensure slot exists
  let slot = document.getElementById(SLOT_ID);
  if (!slot) {
    slot = document.createElement('div');
    slot.id = SLOT_ID;
    document.body.prepend(slot);
  }

  // Fetch and inject header
  let html = '';
  try {
    const res = await fetch(PARTIAL, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`fetch ${PARTIAL} -> ${res.status}`);
    html = await res.text();
  } catch (e) {
    log(`failed to load header: ${e.message}`);
    slot.innerHTML = `<div style="padding:12px;background:#fffaf5;border-bottom:1px solid rgba(0,0,0,.06)">
      <strong>MEMOIR APP</strong> — <a href="/landing.html">Home</a> | <a href="/record.html">Record</a> | <a href="/stories.html">My Stories</a>
    </div>`;
    return;
  }

  slot.innerHTML = html;

  // Wait until lang helper is ready (should be since lang.js loads first, but guard anyway)
  await new Promise(resolve => {
    if (window.MEMOIR_I18N) return resolve();
    const id = setInterval(() => {
      if (window.MEMOIR_I18N) { clearInterval(id); resolve(); }
    }, 20);
    setTimeout(() => { clearInterval(id); resolve(); }, 1500);
  });

  const I18N = window.MEMOIR_I18N;
  if (!I18N) { log('I18N not present'); return; }

  // Elements
  const toggle   = slot.querySelector('#lang-toggle');
  const menu     = slot.querySelector('#lang-dropdown');
  const items    = slot.querySelectorAll('.lang-item[data-lang]');
  const flagEl   = slot.querySelector('#lang-current-flag');
  const labelEl  = slot.querySelector('#lang-current-label');

  // Helper: set current badge
  function setBadge(code) {
    const map = { en:'🇬🇧', fr:'🇫🇷', nl:'🇧🇪', es:'🇪🇸' };
    if (flagEl)  flagEl.textContent  = map[code] || '🌐';
    if (labelEl) labelEl.textContent = (
      {en:'English', fr:'Français', nl:'Nederlands', es:'Español'}[code] || code
    );
  }

  // Open/close helpers
  function openMenu(){
    if (!menu) return;
    menu.hidden = false;
    toggle?.setAttribute('aria-expanded','true');
  }
  function closeMenu(){
    if (!menu) return;
    menu.hidden = true;
    toggle?.setAttribute('aria-expanded','false');
  }
  function toggleMenu(){
    if (!menu) return;
    (menu.hidden === true || menu.hidden === 'true' || menu.style.display === 'none') ? openMenu() : closeMenu();
  }

  // Wire toggle
  toggle?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(); });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!menu || menu.hidden) return;
    if (!menu.contains(e.target) && e.target !== toggle) closeMenu();
  });

  // Select a language
  items.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const code = btn.getAttribute('data-lang');
      if (!code) return;
      I18N.setLang(code);         // updates texts & emits event
      setBadge(code);             // update badge right away
      closeMenu();
    });
  });

  // Initialize from stored language
  const current = I18N.getLang();
  setBadge(current);
  I18N.apply(current);            // translate any header labels with data-i18n

  // Keep header in sync if language changes elsewhere (e.g., Settings page)
  window.addEventListener('memoir:lang', (ev) => {
    const code = ev?.detail?.code || I18N.getLang();
    setBadge(code);
    I18N.apply(code);
  });

  log('loaded');
})();
