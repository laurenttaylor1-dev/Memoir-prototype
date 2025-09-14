/* Header loader — fetches /partials/header.html, wires language menu, works with lang.js */
(function () {
  const SLOT_ID = "site-header";
  const PARTIAL = "/partials/header.html";

  // Wait for lang.js to exist before wiring translations
  function waitI18N(cb) {
    if (window.MEMOIR_I18N) return cb();
    const h = setInterval(() => {
      if (window.MEMOIR_I18N) { clearInterval(h); cb(); }
    }, 25);
    // stop waiting after 5s so we don't loop forever
    setTimeout(() => clearInterval(h), 5000);
  }

  async function load() {
    const slot = document.getElementById(SLOT_ID);
    if (!slot) return;

    try {
      // cache-bust so you don’t see a stale file in Vercel/CDN
      const res = await fetch(PARTIAL + "?v=24", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch_failed");
      const html = await res.text();

      // Guard: some hosts return the *page html* for 404s (hence the “Unexpected token <”)
      const snip = html.trim().slice(0, 40).toLowerCase();
      if (snip.startsWith("<!doctype") || snip.startsWith("<html")) {
        throw new Error("got_html");
      }

      slot.innerHTML = html;
      console.info("[header-loader] loaded");
    } catch (e) {
      console.warn("[header-loader] failed, using fallback", e);
      slot.innerHTML = `
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/landing.html">
      <span class="logo"></span>
      <span class="brand-text">
        <strong>MEMOIR APP</strong>
        <small>Preserve your memories forever</small>
      </span>
    </a>
    <nav class="nav">
      <a class="pill" id="navHome"   href="/landing.html">Home</a>
      <a class="pill" id="navLogin"  href="/login.html">Login</a>
      <a class="pill" id="navRecord" href="/record.html">Record</a>
      <a class="pill" id="navStories" href="/stories.html">My Stories</a>

      <div class="lang" id="lang-menu">
        <button id="lang-toggle" class="pill lang-toggle" type="button" aria-haspopup="true" aria-expanded="false">
          <span id="lang-current-flag">🇬🇧</span>
          <span id="lang-current-label">English</span>
          <svg class="chev" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
            <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div id="lang-dropdown" class="lang-menu" role="menu" hidden>
          <button class="lang-item" data-lang="en" role="menuitem">🇬🇧 English</button>
          <button class="lang-item" data-lang="fr" role="menuitem">🇫🇷 Français</button>
          <button class="lang-item" data-lang="nl" role="menuitem">🇧🇪 Nederlands</button>
          <button class="lang-item" data-lang="es" role="menuitem">🇪🇸 Español</button>
        </div>
      </div>
    </nav>
  </div>
</header>`;
    }

    // After HTML is in the page, translate and wire the dropdown
    waitI18N(() => {
      try { window.MEMOIR_I18N.apply(document.getElementById(SLOT_ID)); } catch {}

      // If header.html uses plain text, sync the labels via IDs:
      const t = window.MEMOIR_I18N.t;
      ["navHome","navLogin","navRecord","navStories"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = t(id);
      });

      wireLangMenu();
      syncCurrentLang();
      window.addEventListener("memoir:lang", syncCurrentLang);
    });
  }

  function syncCurrentLang() {
    if (!window.MEMOIR_I18N) return;
    const code = window.MEMOIR_I18N.getLang();
    const labelMap = {
      en: window.MEMOIR_I18N.t("langEnglish"),
      fr: window.MEMOIR_I18N.t("langFrench"),
      nl: window.MEMOIR_I18N.t("langDutch"),
      es: window.MEMOIR_I18N.t("langSpanish"),
    };
    const flagMap = { en: "🇬🇧", fr: "🇫🇷", nl: "🇧🇪", es: "🇪🇸" };
    const lbl = document.getElementById("lang-current-label");
    const flg = document.getElementById("lang-current-flag");
    if (lbl) lbl.textContent = labelMap[code] || code.toUpperCase();
    if (flg) flg.textContent = flagMap[code] || "🏳️";
  }

  function wireLangMenu() {
    const toggle = document.getElementById("lang-toggle");
    const menu = document.getElementById("lang-dropdown");
    if (!toggle || !menu) return;

    const open  = () => { menu.hidden = false; toggle.setAttribute("aria-expanded","true"); };
    const close = () => { menu.hidden = true;  toggle.setAttribute("aria-expanded","false"); };
    const isOpen = () => !menu.hidden;

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen() ? close() : open();
    });

    menu.querySelectorAll(".lang-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-lang");
        try { window.MEMOIR_I18N.setLang(code); } catch {}
        close();
      });
    });

    document.addEventListener("click", (e) => {
      if (isOpen() && !menu.contains(e.target) && e.target !== toggle) close();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  document.addEventListener("DOMContentLoaded", load);
})();
