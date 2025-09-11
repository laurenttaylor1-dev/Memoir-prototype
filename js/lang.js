// /js/lang.js
(function () {
  const STORAGE_KEY = 'memoir.lang';
  const strings = {
    en: {
      home: 'Home', login: 'Login', record: 'Record', myStories: 'My Stories',
      heroTitleA: 'Preserve Your', heroTitleB: 'Memories Forever',
      heroBlurb: 'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      startRecording: 'Start Recording', viewStories: 'My Stories',
    },
    fr: {
      home: 'Accueil', login: 'Connexion', record: 'Enregistrer', myStories: 'Mes histoires',
      heroTitleA: 'Préservez vos', heroTitleB: 'souvenirs pour toujours',
      heroBlurb: 'Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et « quand cela s’est passé », puis partagez en toute sécurité avec votre famille.',
      startRecording: 'Commencer', viewStories: 'Mes histoires',
    },
    nl: {
      home: 'Home', login: 'Inloggen', record: 'Opnemen', myStories: 'Mijn verhalen',
      heroTitleA: 'Bewaar je', heroTitleB: 'herinneringen voor altijd',
      heroBlurb: 'Neem één keer op, bewaar voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.',
      startRecording: 'Start opname', viewStories: 'Mijn verhalen',
    },
    es: {
      home: 'Inicio', login: 'Entrar', record: 'Grabar', myStories: 'Mis historias',
      heroTitleA: 'Conserva tus', heroTitleB: 'recuerdos para siempre',
      heroBlurb: 'Graba una vez y consérvalo por generaciones. Comienza con un toque, añade un título y “cuándo ocurrió” y comparte con tu familia de forma segura.',
      startRecording: 'Empezar a grabar', viewStories: 'Mis historias',
    },
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }
  function setLang(code) {
    const c = ['en','fr','nl','es'].includes(code) ? code : 'en';
    localStorage.setItem(STORAGE_KEY, c);
    // update any header labels that used data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (strings[c][k]) el.textContent = strings[c][k];
    });
    // broadcast to pages
    const ev = new CustomEvent('memoir:lang', { detail: { code: c } });
    window.dispatchEvent(ev);
  }

  // expose
  window.MEMOIR_I18N = { strings, getLang, setLang };

  // apply once at load (English default)
  document.addEventListener('DOMContentLoaded', () => setLang(getLang()));
})();
