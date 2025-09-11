/* /js/lang.js  —  central i18n + header wiring */

(function () {
  const KEY = "memoir_lang";
  const FLAGS = { en:"🇬🇧", fr:"🇫🇷", nl:"🇧🇪", es:"🇪🇸" };

  // Minimal strings (extend as needed)
  const STRINGS = {
    en: {
      nav: { home:"Home", login:"Login", record:"Record", stories:"My Stories" },
      heroTitleA: "Preserve Your",
      heroTitleB: "Memories Forever",
      heroBlurb:
        "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      ctas: { start:"Start Recording", stories:"My Stories" }
    },
    fr: {
      nav: { home:"Accueil", login:"Connexion", record:"Enregistrer", stories:"Mes histoires" },
      heroTitleA: "Préservez Vos",
      heroTitleB: "Souvenirs Pour Toujours",
      heroBlurb:
        "Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et “quand cela s’est passé”, puis partagez en toute sécurité avec votre famille.",
      ctas: { start:"Commencer", stories:"Mes histoires" }
    },
    nl: {
      nav: { home:"Home", login:"Inloggen", record:"Opnemen", stories:"Mijn verhalen" },
      heroTitleA: "Bewaar Je",
      heroTitleB: "Herinneringen Voor Altijd",
      heroBlurb:
        "Neem één keer op en bewaar voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.",
      ctas: { start:"Opnemen starten", stories:"Mijn verhalen" }
    },
    es: {
      nav: { home:"Inicio", login:"Entrar", record:"Grabar", stories:"Mis historias" },
      heroTitleA: "Conserva Tus",
      heroTitleB: "Recuerdos Para Siempre",
      heroBlurb:
        "Graba una vez, conserva para generaciones. Empieza con un toque, añade un título y “cuándo ocurrió”, y comparte con tu familia de forma segura.",
      ctas: { start:"Empezar a grabar", stories:"Mis historias" }
    }
  };

  function getLang() {
    const saved = localStorage.getItem(KEY);
    return saved && STRINGS[saved] ? saved : "en";
  }

  function setLang(code) {
    const lang = STRINGS[code] ? code : "en";
    localStorage.setItem(KEY, lang);
    updateHeader(lang);     // refresh header labels/flag
    broadcast(lang);        // tell pages to localize
    closeDropdown();        // UX polish
  }

  function broadcast(code) {
    window.dispatchEvent(new CustomEvent("memoir:lang", { detail: { code } }));
  }

  // ---------- Header wiring ----------
  let $toggle, $menu, outsideHandler, escHandler;

  function openDropdown() {
    if ($menu) $menu.hidden = false;
    document.addEventListener("click", outsideHandler, true);
    document.addEventListener("keydown", escHandler, true);
    $toggle?.setAttribute("aria-expanded", "true");
  }
  function closeDropdown() {
    if ($menu) $menu.hidden = true;
    document.removeEventListener("click", outsideHandler, true);
    document.removeEventListener("keydown", escHandler, true);
    $toggle?.setAttribute("aria-expanded", "false");
  }

  function attachHeader() {
    // Called after header is injected (header-loader triggers it)
    const langCode = getLang();

    // Elements inside header.html
    const elFlag  = document.getElementById("lang-current-flag");
    const elLabel = document.getElementById("lang-current-label");
    $toggle       = document.getElementById("lang-toggle");
    $menu         = document.getElementById("lang-dropdown");

    // Nav labels
    const navHome    = document.getElementById("navHome");
    const navLogin   = document.getElementById("navLogin");
    const navRecord  = document.getElementById("navRecord");
    const navStories = document.getElementById("navStories");

    // Apply current state
    if (elFlag)  elFlag.textContent  = FLAGS[langCode] || "🇬🇧";
    if (elLabel) elLabel.textContent = labelFor(langCode);
    if (navHome)    navHome.textContent    = STRINGS[langCode].nav.home;
    if (navLogin)   navLogin.textContent   = STRINGS[langCode].nav.login;
    if (navRecord)  navRecord.textContent  = STRINGS[langCode].nav.record;
    if (navStories) navStories.textContent = STRINGS[langCode].nav.stories;

    // Toggle handlers (re-bind safely)
    if ($toggle) {
      $toggle.onclick = (e) => {
        e.preventDefault();
        if ($menu?.hidden) openDropdown();
        else closeDropdown();
      };
    }
    outsideHandler = (e) => {
      if (!$menu || !$toggle) return;
      if ($menu.contains(e.target) || $toggle.contains(e.target)) return;
      closeDropdown();
    };
    escHandler = (e) => { if (e.key === "Escape") closeDropdown(); };

    // Language item clicks
    $menu?.querySelectorAll(".lang-item").forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const code = btn.getAttribute("data-lang");
        setLang(code);
      };
    });

    // Make sure card/overlay doesn’t hide the menu
    // (CSS still recommended; see note below)
    $menu?.style?.setProperty("z-index", "1000");

    // Tell pages what the current language is
    broadcast(langCode);
  }

  function updateHeader(code) {
    const elFlag  = document.getElementById("lang-current-flag");
    const elLabel = document.getElementById("lang-current-label");
    if (elFlag)  elFlag.textContent  = FLAGS[code] || "🇬🇧";
    if (elLabel) elLabel.textContent = labelFor(code);

    // Update nav too
    const t = STRINGS[code] || STRINGS.en;
    const navHome    = document.getElementById("navHome");
    const navLogin   = document.getElementById("navLogin");
    const navRecord  = document.getElementById("navRecord");
    const navStories = document.getElementById("navStories");
    if (navHome)    navHome.textContent    = t.nav.home;
    if (navLogin)   navLogin.textContent   = t.nav.login;
    if (navRecord)  navRecord.textContent  = t.nav.record;
    if (navStories) navStories.textContent = t.nav.stories;
  }

  function labelFor(code) {
    return { en:"English", fr:"Français", nl:"Nederlands", es:"Español" }[code] || "English";
  }

  // Expose a tiny API
  window.MEMOIR_I18N = {
    strings: STRINGS,
    getLang,
    setLang,
    attachHeader, // header-loader calls this after injection
  };

  // If a header is already in the DOM (rare), wire it once DOM is ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    const hdr = document.getElementById("lang-toggle");
    if (hdr) attachHeader();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      const hdr = document.getElementById("lang-toggle");
      if (hdr) attachHeader();
    });
  }
})();
