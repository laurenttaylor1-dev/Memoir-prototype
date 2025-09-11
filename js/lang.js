// /js/lang.js
(function () {
  const DEFAULT = "en";
  const storeKey = "memoir.lang";

  const strings = {
    en: {
      navHome: "Home", navLogin: "Login", navRecord: "Record", navStories: "My Stories",
      startRecording: "Start Recording", viewStories: "My Stories",
      heroTitleA: "Preserve Your", heroTitleB: "Memories Forever",
      heroBlurb:
        "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family."
    },
    fr: {
      navHome: "Accueil", navLogin: "Connexion", navRecord: "Enregistrer", navStories: "Mes histoires",
      startRecording: "Commencer l’enregistrement", viewStories: "Mes histoires",
      heroTitleA: "Préservez vos", heroTitleB: "Souvenirs pour toujours",
      heroBlurb:
        "Enregistrez une fois pour des générations. Commencez en un geste, ajoutez un titre et « quand c’est arrivé », puis partagez en toute sécurité avec votre famille."
    },
    nl: {
      navHome: "Home", navLogin: "Inloggen", navRecord: "Opnemen", navStories: "Mijn verhalen",
      startRecording: "Opname starten", viewStories: "Mijn verhalen",
      heroTitleA: "Bewaar je", heroTitleB: "Herinneringen voor altijd",
      heroBlurb:
        "Neem één keer op voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie."
    },
    es: {
      navHome: "Inicio", navLogin: "Entrar", navRecord: "Grabar", navStories: "Mis historias",
      startRecording: "Comenzar a grabar", viewStories: "Mis historias",
      heroTitleA: "Conserva tus", heroTitleB: "Recuerdos para siempre",
      heroBlurb:
        "Graba una vez para generaciones. Empieza con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura con tu familia."
    }
  };

  function getLang() {
    return localStorage.getItem(storeKey) || DEFAULT;
  }
  function setLang(code) {
    localStorage.setItem(storeKey, code);
    document.documentElement.setAttribute("lang", code);
    // tell every page section to re-render
    window.dispatchEvent(new CustomEvent("memoir:lang", { detail: { code } }));
  }

  // expose
  window.MEMOIR_I18N = { strings, getLang, setLang };
})();
