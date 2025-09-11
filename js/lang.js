// js/lang.js
// Global i18n util for Memoir

(function () {
  const STORAGE_KEY = 'memoir.lang';
  const defaultLang = 'en';

  // ---- Strings used across pages (expand anytime) ----
  const STR = {
    en: {
      heroTitleA: 'Preserve Your',
      heroTitleB: 'Memories Forever',
      heroBlurb:
        'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      startRecording: 'Start Recording',
      viewStories: 'My Stories',
    },
    fr: {
      heroTitleA: 'Préservez vos',
      heroTitleB: 'Souvenirs pour toujours',
      heroBlurb:
        'Enregistrez une fois, transmettez aux générations. Lancez un enregistrement en un geste, ajoutez un titre et “quand cela s’est passé”, puis partagez en toute sécurité avec votre famille.',
      startRecording: 'Commencer',
      viewStories: 'Mes histoires',
    },
    es: {
      heroTitleA: 'Conserva tus',
      heroTitleB: 'Recuerdos para siempre',
      heroBlurb:
        'Graba una vez y conserva por generaciones. Empieza con un toque, añade un título y “cuándo ocurrió”, y compártelo con tu familia de forma segura.',
      startRecording: 'Empezar a grabar',
      viewStories: 'Mis historias',
    },
    nl: {
      heroTitleA: 'Bewaar je',
      heroTitleB: 'Herinneringen voor altijd',
      heroBlurb:
        'Neem één keer op en bewaar het voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe, en deel veilig met je familie.',
      startRecording: 'Opname starten',
      viewStories: 'Mijn verhalen',
    }
  };

  function getLang() {
    // 1) explicit choice -> 2) existing storage -> 3) browser -> 4) default
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && STR[saved]) return saved;

    const nav =
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      defaultLang;
    const short = String(nav).slice(0, 2).toLowerCase();
    return STR[short] ? short : defaultLang;
  }

  function setLang(code) {
    const lang = STR[code] ? code : defaultLang;
    localStorage.setItem(STORAGE_KEY, lang);
    // Broadcast to all pages/components
    const ev = new CustomEvent('memoir:lang', { detail: { code: lang } });
    window.dispatchEvent(ev);
  }

  // Expose on window
  window.MEMOIR_I18N = {
    strings: STR,
    getLang,
    setLang,
  };

  // Make sure first paint uses a consistent language
  // Defer so page listeners can attach first.
  window.addEventListener('DOMContentLoaded', () => {
    const lang = getLang();
    setTimeout(() => {
      const ev = new CustomEvent('memoir:lang', { detail: { code: lang } });
      window.dispatchEvent(ev);
    }, 0);
  });
})();
