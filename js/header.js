// /js/header.js
(function () {
  async function enhanceHeader() {
    const header = document.querySelector(".site-header");
    if (!header || !window.MEMOIR_I18N) return;

    // Localise nav labels
    const code = window.MEMOIR_I18N.getLang();
    updateNavTexts(code);

    // Language dropdown behaviour
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    const label = document.getElementById("langLabel");
    if (!btn || !menu) return;

    // Reflect current language on load
    setBtnVisual(code);

    // Toggle open/close
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = menu.hasAttribute("hidden");
      document.querySelectorAll(".lang-menu").forEach(m => m.setAttribute("hidden", ""));
      if (isHidden) menu.removeAttribute("hidden");
      else menu.setAttribute("hidden", "");
    });

    // Choose language
    menu.querySelectorAll("button[data-lang]").forEach(b => {
      b.addEventListener("click", (e) => {
        const lng = e.currentTarget.getAttribute("data-lang");
        setBtnVisual(lng);
        window.MEMOIR_I18N.setLang(lng);
        menu.setAttribute("hidden", "");   // <— close immediately
      });
    });

    // Click-outside to close
    document.addEventListener("click", () => menu.setAttribute("hidden", ""));

    // Propagate updates to header pieces when language changes
    window.addEventListener("memoir:lang", (ev) => {
      updateNavTexts(ev.detail.code);
    });

    function setBtnVisual(lng) {
      const mapping = { en: "🇬🇧 English", fr: "🇫🇷 Français", nl: "🇧🇪 Nederlands", es: "🇪🇸 Español" };
      const parts = (mapping[lng] || mapping.en).split(" ");
      label.textContent = parts.slice(1).join(" ");
      btn.querySelector(".flag").textContent = parts[0];
    }

    function updateNavTexts(lng) {
      const t = window.MEMOIR_I18N.strings[lng] || window.MEMOIR_I18N.strings.en;
      header.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) el.textContent = t[key];
      });
    }
  }

  // run after header is injected by header-loader
  document.addEventListener("DOMContentLoaded", enhanceHeader);
  window.addEventListener("memoir:header:ready", enhanceHeader);
})();
