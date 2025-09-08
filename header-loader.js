// /header-loader.js
(async function injectHeader(){
  const slot = document.getElementById('header-slot');
  if (!slot) return;
  try {
    const res = await fetch('/header.html', { cache: 'no-store' });
    const html = await res.text();
    slot.innerHTML = html;

    // After injection, bind header interactions and apply current language
    if (typeof window.initHeaderBindings === 'function') window.initHeaderBindings();
    const lang = localStorage.getItem('memoir.lang') || 'en';
    if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
  } catch (e) {
    console.error('Failed to load header.html', e);
  }
})();
