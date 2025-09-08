(async ()=>{
  const target = document.getElementById("site-header");
  if (!target) return;

  const resp = await fetch("/header.html");
  const html = await resp.text();
  target.innerHTML = html;

  // Now re-bind header events (language menu, etc.)
  if (window.initHeaderBindings) window.initHeaderBindings();
})();
