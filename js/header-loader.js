<script>
// Inject /partials/header.html and /partials/footer.html.
// Also wires the language dropdown so it closes on select and on outside click.
document.addEventListener('DOMContentLoaded', async () => {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');

  async function inject(target, url) {
    if (!target) return;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch ' + url);
    target.innerHTML = await res.text();

    // --- Language menu wiring ---
    const langBtn  = target.querySelector('[data-lang-btn]');
    const langMenu = target.querySelector('[data-lang-menu]');

    function hideMenu() {
      langMenu?.classList.add('hidden');
      document.removeEventListener('click', onDoc);
    }
    function onDoc(e) {
      if (!langMenu?.contains(e.target) && !langBtn?.contains(e.target)) hideMenu();
    }

    // Open/close
    langBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu?.classList.toggle('hidden');
      if (!langMenu?.classList.contains('hidden')) {
        document.addEventListener('click', onDoc);
      } else {
        document.removeEventListener('click', onDoc);
      }
    });

    // Select language => close immediately
    langMenu?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-set-lang]');
      if (!btn) return;
      // Dispatch event to lang.js
      const code = btn.getAttribute('data-set-lang');
      window.dispatchEvent(new CustomEvent('memoir:set-lang', { detail: { code } }));
      hideMenu();
    });
  }

  try {
    await inject(headerSlot, '/partials/header.html');
  } catch (e) { console.warn(e); }

  try {
    await inject(footerSlot, '/partials/footer.html');
  } catch (e) { console.warn(e); }
});
</script>
