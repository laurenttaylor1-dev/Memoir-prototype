<!-- js/header.js -->
<script>
(async () => {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const res = await fetch('/components/header.html', { cache: 'no-store' });
  mount.innerHTML = await res.text();

  // Simple language rememberer
  const sel = document.getElementById('mk-lang');
  const saved = localStorage.getItem('mk.lang') || 'en';
  if (sel) { sel.value = saved; sel.onchange = () => { localStorage.setItem('mk.lang', sel.value); location.reload(); }; }
})();
</script>
