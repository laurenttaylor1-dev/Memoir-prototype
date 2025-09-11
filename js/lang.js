<script>
// =============== MEMOIR I18N ===============
(function(){
  const STRINGS = {
    en: {
      // Header
      navHome: "Home",
      navLogin: "Login",
      navRecord: "Record",
      navStories: "My Stories",
      navLang: "English",

      // Landing
      heroTitleA: "Preserve Your",
      heroTitleB: "Memories Forever",
      heroBlurb: "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      startRecording: "Start Recording",
      viewStories: "My Stories",

      // Record
      recordTitle: "Record",
      todaysPrompts: "Today's suggested prompts",
      suggestOther: "Suggest other prompts",
      notesLabel: "Notes (optional)",
      notesPH: "Add a quick note…",
      titleLabel: "Title",
      titlePH: "Story title",
      whenLabel: "When did this happen?",
      whenPH: 'e.g. "summer 1945", "early 2018", "15 Feb 1972"',
      addPhoto: "Add photo (optional)",
      transcript: "Transcript",
      transcriptEmpty: "Your words will appear here…",
      saveStory: "Save story",
      myStories: "My Stories",

      // Stories
      storiesPageTitle: "My Stories",
      storiesLead: "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      storiesCount: "Stories",
      familyCount: "Family Members",
      inviteLabel: "Invite Family Member",
      invitePH: "email@example.com",
      inviteBtn: "Invite",

      // Login
      loginTitle: "Login",
      loginLead: "Sign in to access your private library across all devices.",
      emailLabel: "Email",
      emailPH: "you@example.com",
      pwdLabel: "Password",
      signIn: "Sign in",
      cancel: "Cancel",

      // Footer sections
      faq: "FAQ",
      pricing: "Pricing",
      about: "About",
      planPremium: "Premium — €4.99/month",
      planFamily: "Family — €7.99/month (up to 4 read-only family members)",
      upgrade: "Upgrade",
      footerBrand: "© Memoir App"
    },

    fr: {
      navHome: "Accueil",
      navLogin: "Connexion",
      navRecord: "Enregistrer",
      navStories: "Mes histoires",
      navLang: "Français",

      heroTitleA: "Préservez",
      heroTitleB: "Vos Souvenirs Pour Toujours",
      heroBlurb: "Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et « quand cela s’est passé », puis partagez en toute sécurité avec votre famille.",
      startRecording: "Commencer l’enregistrement",
      viewStories: "Mes histoires",

      recordTitle: "Enregistrer",
      todaysPrompts: "Suggestions du jour",
      suggestOther: "Suggérer d’autres idées",
      notesLabel: "Notes (facultatif)",
      notesPH: "Ajoutez une courte note…",
      titleLabel: "Titre",
      titlePH: "Titre de l’histoire",
      whenLabel: "Quand cela s’est-il passé ?",
      whenPH: 'ex. « été 1945 », « début 2018 », « 15 fév. 1972 »',
      addPhoto: "Ajouter une photo (facultatif)",
      transcript: "Transcription",
      transcriptEmpty: "Vos mots s’afficheront ici…",
      saveStory: "Enregistrer l’histoire",
      myStories: "Mes histoires",

      storiesPageTitle: "Mes histoires",
      storiesLead: "Enregistrez une fois, gardez pour des générations. Lancez, ajoutez un titre et « quand », puis partagez en privé.",
      storiesCount: "Histoires",
      familyCount: "Membres de la famille",
      inviteLabel: "Inviter un membre de la famille",
      invitePH: "email@exemple.com",
      inviteBtn: "Inviter",

      loginTitle: "Connexion",
      loginLead: "Connectez-vous pour accéder à votre bibliothèque privée sur tous vos appareils.",
      emailLabel: "E-mail",
      emailPH: "vous@exemple.com",
      pwdLabel: "Mot de passe",
      signIn: "Se connecter",
      cancel: "Annuler",

      faq: "FAQ",
      pricing: "Tarifs",
      about: "À propos",
      planPremium: "Premium — 4,99 €/mois",
      planFamily: "Famille — 7,99 €/mois (jusqu’à 4 lecteurs)",
      upgrade: "Passer au Premium",
      footerBrand: "© Memoir App"
    },

    nl: {
      navHome: "Home",
      navLogin: "Inloggen",
      navRecord: "Opnemen",
      navStories: "Mijn verhalen",
      navLang: "Nederlands",

      heroTitleA: "Bewaar je",
      heroTitleB: "Herinneringen voor Altijd",
      heroBlurb: "Neem één keer op, bewaar voor generaties. Start met één tik, voeg een titel en ‘wanneer het gebeurde’ toe en deel veilig met je familie.",
      startRecording: "Opname starten",
      viewStories: "Mijn verhalen",

      recordTitle: "Opnemen",
      todaysPrompts: "Suggesties van vandaag",
      suggestOther: "Andere suggesties",
      notesLabel: "Notities (optioneel)",
      notesPH: "Voeg een korte notitie toe…",
      titleLabel: "Titel",
      titlePH: "Titel van het verhaal",
      whenLabel: "Wanneer gebeurde dit?",
      whenPH: 'bijv. "zomer 1945", "begin 2018", "15 feb 1972"',
      addPhoto: "Foto toevoegen (optioneel)",
      transcript: "Transcript",
      transcriptEmpty: "Je woorden verschijnen hier…",
      saveStory: "Verhaal opslaan",
      myStories: "Mijn verhalen",

      storiesPageTitle: "Mijn verhalen",
      storiesLead: "Neem één keer op, bewaar voor generaties. Start, voeg een titel en ‘wanneer’ toe, en deel privé.",
      storiesCount: "Verhalen",
      familyCount: "Familieleden",
      inviteLabel: "Nodig familielid uit",
      invitePH: "email@voorbeeld.com",
      inviteBtn: "Uitnodigen",

      loginTitle: "Inloggen",
      loginLead: "Log in om je privébibliotheek op alle apparaten te gebruiken.",
      emailLabel: "E-mail",
      emailPH: "jij@voorbeeld.com",
      pwdLabel: "Wachtwoord",
      signIn: "Inloggen",
      cancel: "Annuleren",

      faq: "FAQ",
      pricing: "Prijzen",
      about: "Over",
      planPremium: "Premium — €4,99/maand",
      planFamily: "Family — €7,99/maand (tot 4 lezers)",
      upgrade: "Upgraden",
      footerBrand: "© Memoir App"
    },

    es: {
      navHome: "Inicio",
      navLogin: "Acceder",
      navRecord: "Grabar",
      navStories: "Mis historias",
      navLang: "Español",

      heroTitleA: "Conserva tus",
      heroTitleB: "Recuerdos para Siempre",
      heroBlurb: "Graba una vez, guarda por generaciones. Comienza con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura con tu familia.",
      startRecording: "Empezar a grabar",
      viewStories: "Mis historias",

      recordTitle: "Grabar",
      todaysPrompts: "Sugerencias de hoy",
      suggestOther: "Sugerir otras ideas",
      notesLabel: "Notas (opcional)",
      notesPH: "Añade una nota rápida…",
      titleLabel: "Título",
      titlePH: "Título de la historia",
      whenLabel: "¿Cuándo sucedió?",
      whenPH: 'p.ej. "verano de 1945", "inicios de 2018", "15 feb 1972"',
      addPhoto: "Añadir foto (opcional)",
      transcript: "Transcripción",
      transcriptEmpty: "Tus palabras aparecerán aquí…",
      saveStory: "Guardar historia",
      myStories: "Mis historias",

      storiesPageTitle: "Mis historias",
      storiesLead: "Graba una vez, guarda por generaciones. Empieza, añade título y “cuándo”, y comparte en privado.",
      storiesCount: "Historias",
      familyCount: "Miembros de la familia",
      inviteLabel: "Invitar familiar",
      invitePH: "correo@ejemplo.com",
      inviteBtn: "Invitar",

      loginTitle: "Acceder",
      loginLead: "Inicia sesión para acceder a tu biblioteca privada en todos tus dispositivos.",
      emailLabel: "Correo",
      emailPH: "tú@ejemplo.com",
      pwdLabel: "Contraseña",
      signIn: "Entrar",
      cancel: "Cancelar",

      faq: "FAQ",
      pricing: "Precios",
      about: "Acerca de",
      planPremium: "Premium — 4,99 €/mes",
      planFamily: "Familiar — 7,99 €/mes (hasta 4 lectores)",
      upgrade: "Mejorar",
      footerBrand: "© Memoir App"
    }
  };

  const LS_KEY = "memoir.lang";

  function t(lang, key){
    const pack = STRINGS[lang] || STRINGS.en;
    return (pack && pack[key]) || STRINGS.en[key] || key;
  }

  // Auto-translate data-i18n elements and some known IDs
  function applyToDocument(lang){
    // 1) data-i18n (text)
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      el.textContent = t(lang, key);
    });
    // 2) placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(lang, key));
    });
    // 3) aria-label
    document.querySelectorAll("[data-i18n-aria]").forEach(el=>{
      const key = el.getAttribute("data-i18n-aria");
      el.setAttribute("aria-label", t(lang, key));
    });

    // 4) Known IDs already present in your pages (safe: only updates if found)
    const byId = (id, key) => { const el = document.getElementById(id); if(el) el.textContent = t(lang, key); };
    const setPH = (id, key) => { const el = document.getElementById(id); if(el) el.placeholder = t(lang, key); };

    // Landing
    byId("heroA","heroTitleA"); byId("heroB","heroTitleB");
    byId("heroBlurb","heroBlurb");
    byId("ctaStart","startRecording"); byId("ctaStories","viewStories");
    byId("startLabel","startRecording"); byId("startTitle","startRecording"); byId("startBtn","startRecording");
    byId("viewLabel","viewStories"); byId("viewTitle","viewStories"); byId("viewBtn","viewStories");

    // Record
    byId("pageTitle","recordTitle");
    byId("promptsHdr","todaysPrompts");
    byId("btnShuffle","suggestOther");
    byId("notesLabel","notesLabel"); setPH("notesPH","notesPH");
    byId("titleLabel","titleLabel"); setPH("titlePH","titlePH");
    byId("whenLabel","whenLabel"); setPH("whenPH","whenPH");
    byId("addPhotoLabel","addPhoto");
    byId("transcriptLabel","transcript");
    const tx = document.getElementById("transcriptArea");
    if(tx && !tx.value) tx.placeholder = t(lang,"transcriptEmpty");
    byId("saveBtn","saveStory");
    byId("myStoriesBtn","myStories");

    // Stories
    byId("storiesTitle","storiesPageTitle");
    byId("storiesLead","storiesLead");
    byId("storiesCountLabel","storiesCount");
    byId("familyCountLabel","familyCount");
    byId("inviteLabel","inviteLabel");
    setPH("invitePH","invitePH");
    byId("inviteBtn","inviteBtn");

    // Login
    byId("loginTitle","loginTitle");
    byId("loginLead","loginLead");
    byId("emailLabel","emailLabel");
    setPH("emailPH","emailPH");
    byId("pwdLabel","pwdLabel");
    byId("signInBtn","signIn");
    byId("cancelBtn","cancel");

    // Footer sections, if present
    byId("footerFAQ","faq");
    byId("footerPricing","pricing");
    byId("footerAbout","about");
    byId("footerPlanPremium","planPremium");
    byId("footerPlanFamily","planFamily");
    byId("footerUpgrade","upgrade");
    byId("footerBrand","footerBrand");
  }

  // Public API on window
  window.MEMOIR_I18N = {
    strings: STRINGS,
    getLang(){
      const saved = localStorage.getItem(LS_KEY);
      return (saved && STRINGS[saved]) ? saved : "en";
    },
    setLang(code){
      const lang = STRINGS[code] ? code : "en";
      localStorage.setItem(LS_KEY, lang);
      // Translate immediately so the whole page updates
      try { applyToDocument(lang); } catch(e){}
      // Broadcast for any page-specific logic (guided prompts, etc.)
      window.dispatchEvent(new CustomEvent("memoir:lang", { detail:{ code: lang }}));
    },
    t:(key)=> t(MEMOIR_I18N.getLang(), key),
    apply: ()=> applyToDocument(MEMOIR_I18N.getLang())
  };

  // Initial apply on DOM ready
  document.addEventListener("DOMContentLoaded", ()=>{
    const current = window.MEMOIR_I18N.getLang();
    applyToDocument(current);
    // Also fire an initial event so any listeners (e.g., guided prompts) run once
    window.dispatchEvent(new CustomEvent("memoir:lang", { detail:{ code: current }}));
  });
})();
</script>
