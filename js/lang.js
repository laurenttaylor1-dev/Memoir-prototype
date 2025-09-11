<script>
/* ========= Memoir I18N =========
   Drop-in global translator.
   - Persists language in localStorage("memoir:lang")
   - Dispatches CustomEvent("memoir:lang", {detail:{code}})
   - Updates header labels (#navHome, #navLogin, #navRecord, #navStories)
   - Exposes: MEMOIR_I18N.getLang(), setLang(code), t(key)
*/
(function () {
  const LS_KEY = "memoir:lang";
  const DEFAULT = "en";

  // ---- Texts used across the site ----
  const S = {
    en: {
      // Header
      navHome: "Home",
      navLogin: "Login",
      navRecord: "Record",
      navStories: "My Stories",
      // Landing hero
      heroTitleA: "Preserve Your",
      heroTitleB: "Memories Forever",
      heroBlurb:
        "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      startRecording: "Start Recording",
      viewStories: "My Stories",

      // Quick cards (landing)
      cardStartTitle: "Start Recording",
      cardStartBody:
        "One tap to begin. Add a title and “when it happened” later.",
      cardViewTitle: "View My Stories",
      cardViewBody:
        "Browse, rewrite with AI, export, and share with your family.",

      // Feature trio
      f1Title: "Smart Transcription",
      f1Body: "AI-powered voice-to-text conversion.",
      f2Title: "Multi-language Support",
      f2Body: "Record and transcribe in multiple languages.",
      f3Title: "Private Library",
      f3Body:
        "Organize and share securely with your family.",

      // Pricing + FAQ
      pricingTitle: "Pricing",
      pricingPremium: "Premium — €4.99/month",
      pricingFamily: "Family — €7.99/month (up to 4 read-only family members)",
      upgrade: "Upgrade",

      faqTitle: "FAQ",
      faqQ1: "Is there a free plan?",
      faqA1:
        "Yes, you can try the app for free before upgrading.",
      faqQ2: "Which languages are supported?",
      faqA2:
        "English, Français, Nederlands, Español (more coming).",
      faqQ3: "How is transcription done?",
      faqA3:
        "Server-side Whisper for high accuracy; works offline then syncs later.",

      // Footer
      aboutTitle: "About",
      aboutBody:
        "Memoir helps families capture life stories with beautiful voice capture, AI transcription, and a private library.",

      // Record page
      recordTitle: "Record",
      promptsTitle: "Today's suggested prompts",
      suggestOther: "Suggest other prompts",
      notesOptional: "Notes (optional)",
      titleLabel: "Title",
      whenLabel: "When did this happen?",
      whenPh: 'e.g. "summer 1945", "early 2018", "15 Feb 1972"',
      addPhotoLabel: "Add photo (optional)",
      transcriptLabel: "Transcript",
      transcriptHintOnline: "Recording… transcription will appear live when online.",
      transcriptHintOffline: "Offline or server unavailable — audio will be saved locally and sent later.",
      saveStory: "Save story",
      myStoriesBtn: "My Stories",
      storyTitlePh: "Story title",

      // Stories page
      storiesTitle: "My Stories",
      storiesIntro:
        "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      storiesCount: "Stories",
      familyCount: "Family Members",
      inviteLabel: "Invite Family Member",
      inviteBtn: "Invite",

      // Guided prompt sentence templates
      guidePrefix: "Tell me about",
      guideAboutChildhood: "your childhood.",
      guideAboutFamily: "your family or a special family moment.",
      guideAboutSchool: "your school days or a favorite teacher.",
      guideAboutWork: "your work or a proud achievement.",
      guideAboutLove: "how you met someone you love.",
      guideAboutWar: "a difficult period and what you learned.",
      guideAboutTravel: "a trip that changed you.",
      guideAboutTraditions: "a family tradition you cherish.",
      guideAboutHolidays: "a holiday memory.",
      guideAboutLessons: "a life lesson you’d pass on.",
      guideAboutAdvice: "advice for younger generations.",
      guideAboutTurning: "a turning point in your life."
    },

    fr: {
      navHome: "Accueil",
      navLogin: "Connexion",
      navRecord: "Enregistrer",
      navStories: "Mes histoires",

      heroTitleA: "Préservez vos",
      heroTitleB: "souvenirs pour toujours",
      heroBlurb:
        "Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et « quand cela s’est produit », puis partagez en toute sécurité avec votre famille.",
      startRecording: "Commencer",
      viewStories: "Mes histoires",

      cardStartTitle: "Commencer",
      cardStartBody:
        "Un geste pour démarrer. Ajoutez le titre et « quand » plus tard.",
      cardViewTitle: "Mes histoires",
      cardViewBody:
        "Feuilletez, réécrivez avec l’IA, exportez et partagez en famille.",

      f1Title: "Transcription intelligente",
      f1Body: "Conversion voix-texte par IA.",
      f2Title: "Multi-langue",
      f2Body: "Enregistrez et transcrivez en plusieurs langues.",
      f3Title: "Bibliothèque privée",
      f3Body: "Organisez et partagez en toute sécurité.",

      pricingTitle: "Tarifs",
      pricingPremium: "Premium — 4,99 €/mois",
      pricingFamily:
        "Famille — 7,99 €/mois (jusqu’à 4 membres en lecture seule)",
      upgrade: "Passer Premium",

      faqTitle: "FAQ",
      faqQ1: "Y a-t-il une offre gratuite ?",
      faqA1:
        "Oui, vous pouvez essayer l’app gratuitement avant de passer à l’abonnement.",
      faqQ2: "Quelles langues sont prises en charge ?",
      faqA2:
        "Anglais, Français, Néerlandais, Espagnol (d’autres arrivent).",
      faqQ3: "Comment se fait la transcription ?",
      faqA3:
        "Whisper côté serveur pour une haute précision ; fonctionne hors-ligne puis se synchronise.",

      aboutTitle: "À propos",
      aboutBody:
        "Memoir aide les familles à préserver leurs histoires avec une capture vocale soignée, une transcription IA et une bibliothèque privée.",

      recordTitle: "Enregistrer",
      promptsTitle: "Suggestions du jour",
      suggestOther: "Suggérer d’autres sujets",
      notesOptional: "Notes (facultatif)",
      titleLabel: "Titre",
      whenLabel: "Quand cela s’est-il passé ?",
      whenPh: 'ex. « été 1945 », « début 2018 », « 15 févr. 1972 »',
      addPhotoLabel: "Ajouter une photo (facultatif)",
      transcriptLabel: "Transcription",
      transcriptHintOnline:
        "Enregistrement… la transcription s’affichera en direct si vous êtes en ligne.",
      transcriptHintOffline:
        "Hors-ligne ou serveur indisponible — l’audio sera envoyé plus tard.",
      saveStory: "Enregistrer l’histoire",
      myStoriesBtn: "Mes histoires",
      storyTitlePh: "Titre de l’histoire",

      storiesTitle: "Mes histoires",
      storiesIntro:
        "Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et « quand », puis partagez en sécurité.",
      storiesCount: "Histoires",
      familyCount: "Membres de la famille",
      inviteLabel: "Inviter un membre de la famille",
      inviteBtn: "Inviter",

      guidePrefix: "Parlez-moi de",
      guideAboutChildhood: "votre enfance.",
      guideAboutFamily: "votre famille ou d’un moment précieux.",
      guideAboutSchool: "vos années d’école ou d’un professeur marquant.",
      guideAboutWork: "votre travail ou d’une fierté.",
      guideAboutLove: "votre rencontre avec un être cher.",
      guideAboutWar: "une période difficile et ce qu’elle vous a appris.",
      guideAboutTravel: "un voyage qui vous a changé.",
      guideAboutTraditions: "une tradition familiale chère.",
      guideAboutHolidays: "un souvenir de fête.",
      guideAboutLessons: "une leçon de vie à transmettre.",
      guideAboutAdvice: "un conseil pour les jeunes.",
      guideAboutTurning: "un tournant de votre vie."
    },

    nl: {
      navHome: "Home",
      navLogin: "Inloggen",
      navRecord: "Opnemen",
      navStories: "Mijn verhalen",

      heroTitleA: "Bewaar je",
      heroTitleB: "herinneringen voor altijd",
      heroBlurb:
        "Neem één keer op en bewaar voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.",
      startRecording: "Opname starten",
      viewStories: "Mijn verhalen",

      cardStartTitle: "Opname starten",
      cardStartBody:
        "Met één tik beginnen. Titel en “wanneer” kan later.",
      cardViewTitle: "Mijn verhalen",
      cardViewBody:
        "Blader, herschrijf met AI, exporteer en deel met familie.",

      f1Title: "Slimme transcriptie",
      f1Body: "Door AI aangedreven spraak-naar-tekst.",
      f2Title: "Meertalige ondersteuning",
      f2Body: "Neem op en transcribeer in meerdere talen.",
      f3Title: "Privébibliotheek",
      f3Body: "Organiseer en deel veilig met je familie.",

      pricingTitle: "Prijzen",
      pricingPremium: "Premium — €4,99/maand",
      pricingFamily: "Family — €7,99/maand (tot 4 lezers)",
      upgrade: "Upgraden",

      faqTitle: "FAQ",
      faqQ1: "Is er een gratis plan?",
      faqA1:
        "Ja, je kunt de app gratis proberen voordat je upgrade.",
      faqQ2: "Welke talen worden ondersteund?",
      faqA2:
        "Engels, Frans, Nederlands, Spaans (meer volgt).",
      faqQ3: "Hoe wordt er getranscribeerd?",
      faqA3:
        "Whisper op de server voor hoge nauwkeurigheid; werkt offline en synchroniseert later.",

      aboutTitle: "Over",
      aboutBody:
        "Memoir helpt families levensverhalen vast te leggen met mooie spraakopname, AI-transcriptie en een privébibliotheek.",

      recordTitle: "Opnemen",
      promptsTitle: "Suggesties van vandaag",
      suggestOther: "Andere suggesties",
      notesOptional: "Notities (optioneel)",
      titleLabel: "Titel",
      whenLabel: "Wanneer gebeurde dit?",
      whenPh: 'bijv. "zomer 1945", "begin 2018", "15 feb 1972"',
      addPhotoLabel: "Foto toevoegen (optioneel)",
      transcriptLabel: "Transcript",
      transcriptHintOnline:
        "Opnemen… transcript verschijnt live als je online bent.",
      transcriptHintOffline:
        "Offline of server onbeschikbaar — audio wordt later verzonden.",
      saveStory: "Verhaal opslaan",
      myStoriesBtn: "Mijn verhalen",
      storyTitlePh: "Titel van het verhaal",

      storiesTitle: "Mijn verhalen",
      storiesIntro:
        "Neem één keer op en bewaar voor generaties. Start met één tik, voeg een titel en “wanneer” toe en deel veilig met familie.",
      storiesCount: "Verhalen",
      familyCount: "Familieleden",
      inviteLabel: "Familielid uitnodigen",
      inviteBtn: "Uitnodigen",

      guidePrefix: "Vertel eens over",
      guideAboutChildhood: "je jeugd.",
      guideAboutFamily: "je familie of een bijzonder moment.",
      guideAboutSchool: "je schooltijd of een favoriete docent.",
      guideAboutWork: "je werk of iets waar je trots op bent.",
      guideAboutLove: "hoe je iemand ontmoette van wie je houdt.",
      guideAboutWar: "een moeilijke periode en wat je leerde.",
      guideAboutTravel: "een reis die je veranderde.",
      guideAboutTraditions: "een familietraditie die je koestert.",
      guideAboutHolidays: "een vakantieherinnering.",
      guideAboutLessons: "een levensles die je wilt doorgeven.",
      guideAboutAdvice: "advies voor jongere generaties.",
      guideAboutTurning: "een keerpunt in je leven."
    },

    es: {
      navHome: "Inicio",
      navLogin: "Acceder",
      navRecord: "Grabar",
      navStories: "Mis historias",

      heroTitleA: "Conserva tus",
      heroTitleB: "recuerdos para siempre",
      heroBlurb:
        "Graba una vez y conserva por generaciones. Comienza con un toque, añade un título y “cuándo ocurrió”, y comparte con tu familia de forma segura.",
      startRecording: "Comenzar",
      viewStories: "Mis historias",

      cardStartTitle: "Comenzar",
      cardStartBody:
        "Un toque para empezar. El título y “cuándo” pueden añadirse después.",
      cardViewTitle: "Mis historias",
      cardViewBody:
        "Explora, reescribe con IA, exporta y comparte con tu familia.",

      f1Title: "Transcripción inteligente",
      f1Body: "Voz a texto con IA.",
      f2Title: "Soporte multilenguaje",
      f2Body: "Graba y transcribe en varios idiomas.",
      f3Title: "Biblioteca privada",
      f3Body: "Organiza y comparte con seguridad.",

      pricingTitle: "Precios",
      pricingPremium: "Premium — 4,99 €/mes",
      pricingFamily: "Familiar — 7,99 €/mes (hasta 4 lectores)",
      upgrade: "Mejorar",

      faqTitle: "Preguntas frecuentes",
      faqQ1: "¿Hay un plan gratuito?",
      faqA1:
        "Sí, puedes probar la app gratis antes de suscribirte.",
      faqQ2: "¿Qué idiomas están disponibles?",
      faqA2:
        "Inglés, Francés, Neerlandés, Español (más en camino).",
      faqQ3: "¿Cómo se hace la transcripción?",
      faqA3:
        "Whisper en el servidor para alta precisión; funciona sin conexión y se sincroniza después.",

      aboutTitle: "Acerca de",
      aboutBody:
        "Memoir ayuda a las familias a capturar historias de vida con una hermosa grabación de voz, transcripción con IA y una biblioteca privada.",

      recordTitle: "Grabar",
      promptsTitle: "Sugerencias de hoy",
      suggestOther: "Sugerir otros temas",
      notesOptional: "Notas (opcional)",
      titleLabel: "Título",
      whenLabel: "¿Cuándo pasó?",
      whenPh: 'p. ej., "verano de 1945", "inicios de 2018", "15 feb 1972"',
      addPhotoLabel: "Añadir foto (opcional)",
      transcriptLabel: "Transcripción",
      transcriptHintOnline:
        "Grabando… la transcripción aparecerá en vivo si hay conexión.",
      transcriptHintOffline:
        "Sin conexión o servidor no disponible — el audio se enviará más tarde.",
      saveStory: "Guardar historia",
      myStoriesBtn: "Mis historias",
      storyTitlePh: "Título de la historia",

      storiesTitle: "Mis historias",
      storiesIntro:
        "Graba una vez y conserva por generaciones. Empieza con un toque, añade título y “cuándo”, y comparte con tu familia.",
      storiesCount: "Historias",
      familyCount: "Miembros de la familia",
      inviteLabel: "Invitar a un familiar",
      inviteBtn: "Invitar",

      guidePrefix: "Cuéntame sobre",
      guideAboutChildhood: "tu infancia.",
      guideAboutFamily: "tu familia o un momento especial.",
      guideAboutSchool: "tus días de escuela o un profesor favorito.",
      guideAboutWork: "tu trabajo o un logro del que estés orgulloso.",
      guideAboutLove: "cómo conociste a alguien a quien amas.",
      guideAboutWar: "un período difícil y lo que aprendiste.",
      guideAboutTravel: "un viaje que te cambió.",
      guideAboutTraditions: "una tradición familiar que aprecias.",
      guideAboutHolidays: "un recuerdo de vacaciones.",
      guideAboutLessons: "una lección de vida para transmitir.",
      guideAboutAdvice: "consejos para generaciones jóvenes.",
      guideAboutTurning: "un punto de inflexión en tu vida."
    }
  };

  // ---- tiny helpers ----
  function getLang() {
    return localStorage.getItem(LS_KEY) || DEFAULT;
  }
  function setLang(code) {
    const lang = S[code] ? code : DEFAULT;
    localStorage.setItem(LS_KEY, lang);
    // Update header labels if present
    const t = S[lang];
    const byId = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    byId("navHome", t.navHome);
    byId("navLogin", t.navLogin);
    byId("navRecord", t.navRecord);
    byId("navStories", t.navStories);
    // bubble to all pages
    window.dispatchEvent(new CustomEvent("memoir:lang", { detail: { code: lang } }));
  }
  function t(key, fall = "") {
    const lang = getLang();
    return (S[lang] && S[lang][key]) || (S[DEFAULT] && S[DEFAULT][key]) || fall || key;
  }

  // Expose global
  window.MEMOIR_I18N = {
    strings: S,
    getLang,
    setLang,
    t
  };

  // Auto-init (apply header labels on first load)
  document.addEventListener("DOMContentLoaded", () => setLang(getLang()));
})();
</script>
