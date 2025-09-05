<script>
/* Shared helpers */
window.mk = {
  go: (p)=>{ location.href = p; },
  esc: (s)=> String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])),
  on:  (el,ev,fn)=> el && el.addEventListener(ev,fn)
};

/* Render the top navigation into #mk-nav */
(function renderTopbar(){
  const el = document.getElementById('mk-nav');
  if(!el) return;

  el.innerHTML = `
    <div class="topbar">
      <div class="nav">
        <div class="brand" role="button" tabindex="0" onclick="mk.go('/landing.html')">
          <div class="logo" aria-hidden="true"></div>
          <h1>MemoryKeeper</h1>
        </div>
        <div class="nav-actions">
          <button class="btn" onclick="mk.go('/landing.html')">🏠 Home</button>
          <button class="btn" onclick="mk.go('/index.html')">🎙️ Record</button>
          <button class="btn" onclick="document.dispatchEvent(new CustomEvent('mk-open-library'))">📖 My Stories</button>
          <button class="btn" onclick="document.dispatchEvent(new CustomEvent('mk-open-help'))">❓ Help</button>
          <select id="mk-lang" class="btn">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="nl">Nederlands</option>
          </select>
          <button id="mk-logout" class="btn">Logout</button>
        </div>
      </div>
    </div>
  `;
})();
</script>
