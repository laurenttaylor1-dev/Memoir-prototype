(async ()=>{
  const include = async (sel, url) => {
    const slot = document.querySelector(sel);
    if (!slot) return;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      slot.innerHTML = await res.text();
    } catch (err) {
      console.error('Include failed:', url, err);
      slot.innerHTML = `
        <div style="border:1px solid #f3c2b6;background:#fff7f5;color:#9a2c14;
                    padding:10px;border-radius:8px;margin:8px 0;font:14px/1.4 system-ui">
          Failed to load <strong>${url}</strong> — ${err.message}.<br>
          Open this URL directly in a new tab to debug.
        </div>`;
    }
  };

  await include('#__site-header', '/partials/header.html');
  await include('#__site-footer', '/partials/footer.html');

  // After header loads, you may call shared app.js helpers if needed
  if (window.initHeaderBindings) window.initHeaderBindings();
  if (window.applyTranslations)  window.applyTranslations(localStorage.getItem('memoir.lang')||'en');
})();
