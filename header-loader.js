// Injects /header.html into #site-header, then wires language & i18n
(async () => {
  const host = document.getElementById('site-header');
  if (!host) return;

  try {
    const res = await fetch('/header.html', { cache: 'no-store' });
    const html = await res.text();
    host.innerHTML = html;

    // Ensure our shared runtime is present
    if (window.initHeaderBindings) window.initHeaderBindings();

    const lang = localStorage.getItem('memoir.lang') || 'en';
    if (window.applyTranslations) window.applyTranslations(lang);
  } catch (e) {
    console.error('Header load failed:', e);
  }
})();
