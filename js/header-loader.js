// /header-loader.js
(async () => {
  const host = document.getElementById("site-header");
  if (!host) return;

  // Cache-bust so you always get the newest header.html
  const resp = await fetch(`/header.html?v=${Date.now()}`, { cache: "no-store" });
  const html = await resp.text();
  host.innerHTML = html;

  // Bind header interactions after injection
  if (window.initHeaderBindings) window.initHeaderBindings();
})();
