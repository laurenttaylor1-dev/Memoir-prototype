<script>
// Loads /partials/header.html and /partials/footer.html into placeholders.
document.addEventListener('DOMContentLoaded', async () => {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');

  async function inject(target, url) {
    if (!target) return;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed ' + url);
      target.innerHTML = await res.text();

      // Wire up language dropdown closing / toggling
      const langBtn = target.querySelector('[data-lang-btn]');
      const langMenu = target.querySelector('[data-lang-menu]');
      if (langBtn && langMenu) {
        const closeMenu = (e) => {
          if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
            langMenu.classList.add('hidden');
            document.removeEventListener('click', closeMenu);
          }
        };
        langBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          langMenu.classList.toggle('hidden');
          if (!langMenu.classList.contains('hidden')) {
            document.addEventListener('click', closeMenu);
          }
        });
      }
    } catch (e) {
      console.warn('Partial load failed:', url, e);
    }
  }

  await inject(headerSlot, '/partials/header.html');
  await inject(footerSlot, '/partials/footer.html');
});
</script>
