/* Memoir i18n — EN / FR / NL / ES
   - Stores current language in localStorage('memoir.lang')
   - Exposes:
       MEMOIR_I18N.getLang() -> 'en' | 'fr' | 'nl' | 'es'
       MEMOIR_I18N.setLang(code) -> saves + dispatches 'memoir:lang' with {code}
       MEMOIR_I18N.t(key) -> string for current language (falls back to EN)
   - Dispatch on load so pages initialize from stored language.
*/

(function () {
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'memoir.lang';

  const strings = {
    en: {
      // Header
      brandTitle: "MEMOIR APP",
      brandTagline: "Preserve your memories forever",
      navHome: "Home",
      navLogin: "Login",
      navRecord: "Record",
      navStories: "My Stories",
      langEnglish: "English",
      langFrench: "Français",
      langDutch: "Nederlands",
      langSpanish: "Español",

      // Landing (hero + CTAs)
      heroTitleA: "Preserve Your",
      heroTitleB: "Memories Forever",
      heroBlurb:
        "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      startRecording: "Start Recording",
      viewStories: "My Stories",

      // Landing (3 key points)
      feat1Title: "Capture with one tap",
      feat1Desc:
        "A warm, simple recorder with gentle prompts. Speak naturally; we’ll transcribe and neatly store it.",
      feat2Title: "Organized for a future book",
      feat2Desc:
        "Add “when it happened”, attach a photo, and later export to a clean manuscript layout.",
      feat3Title: "Private by default, share when ready",
      feat3Desc:
        "Your stories are yours. Share with family members you invite — read-only if you prefer.",

      // Landing (pricing)
      pricingTitle: "Pricing",
      planFree: "Free",
      planPremium: "Premium",
      planFamily: "Family",
      planExclusive: "Exclusive",
      priceFree: "€0 / month",
      pricePremium: "€4.99 / month",
      priceFamily: "€7.99 / month",
      priceExclusive: "€14.99 / month",
      freeFeatures: [
        "Unlimited local recording",
        "Basic cloud sync",
        "Guided prompts (voice)"
      ],
      premiumFeatures: [
        "AI rewrite (ghostwriter tone)",
        "Export to PDF (book layout)",
        "Up to 2 hours / month transcription"
      ],
      familyFeatures: [
        "All Premium features",
        "Share with up to 4 members (read & listen)",
        "Family library"
      ],
      exclusiveFeatures: [
        "All Family features",
        "Up to 5 hours / month transcription",
        "Priority support"
      ],
      choosePlan: "Choose plan",

      // Record page
      recTitle: "Record",
      lblGuided: "Today's suggested prompts",
      btnSuggestOther: "Suggest other prompts",
      lblNotes: "Notes (optional)",
      phNotes: "Add a quick note…",
      lblTitle: "Title",
      phTitle: "Story title",
      lblWhen: "When did this happen?",
      phWhen: "e.g. \"summer 1945\", \"early 2018\", \"15 Feb 1972\"",
      lblPhoto: "Add photo (optional)",
      lblTranscript: "Transcript",
      btnRecord: "Record",
      btnStop: "Stop",
      asrRecording: "Recording… transcription will appear live when online.",
      asrListening: "Listening…",
      asrOffline:
        "Offline or server unavailable — audio will be saved locally and sent later.",
      errMic: "Microphone permission denied.",
      defaultStory: "Story",
      errNoTranscript:
        "There is no transcript yet. Say a few words, then try again.",
      okSaved: "Saved! You can find it in My Stories.",
      errSave:
        "Save failed. If you are offline, it will retry when connected.",
      // Stories page
      storiesTitle: "My Stories",
      storiesEmpty: "No stories yet.",
      storiesCount: "Stories",
      storiesSharedWith: "Shared family members",
      storiesShareInvite: "Share with an email address"
    },

    fr: {
      // Header
      brandTitle: "MEMOIR APP",
      brandTagline: "Préservez vos souvenirs pour toujours",
      navHome: "Accueil",
      navLogin: "Connexion",
      navRecord: "Enregistrer",
      navStories: "Mes histoires",
      langEnglish: "Anglais",
      langFrench: "Français",
      langDutch: "Néerlandais",
      langSpanish: "Espagnol",

      // Landing
      heroTitleA: "Préservez vos",
      heroTitleB: "souvenirs pour toujours",
      heroBlurb:
        "Enregistrez une fois, conservez pour des générations. Lancez l’enregistrement en un geste, ajoutez un titre et « quand cela s’est passé », puis partagez en toute sécurité avec votre famille.",
      startRecording: "Commencer l’enregistrement",
      viewStories: "Mes histoires",

      // 3 points
      feat1Title: "Capturer en un geste",
      feat1Desc:
        "Un enregistreur simple et chaleureux avec des invites douces. Parlez naturellement ; nous transcrivons et organisons.",
      feat2Title: "Organisé pour un futur livre",
      feat2Desc:
        "Ajoutez « quand cela s’est passé », joignez une photo, puis exportez vers une mise en page propre.",
      feat3Title: "Privé par défaut, partage à votre rythme",
      feat3Desc:
        "Vos histoires vous appartiennent. Partagez avec des proches invités — en lecture seule si vous préférez.",

      // Pricing
      pricingTitle: "Tarifs",
      planFree: "Gratuit",
      planPremium: "Premium",
      planFamily: "Famille",
      planExclusive: "Exclusif",
      priceFree: "0 € / mois",
      pricePremium: "4,99 € / mois",
      priceFamily: "7,99 € / mois",
      priceExclusive: "14,99 € / mois",
      freeFeatures: [
        "Enregistrement local illimité",
        "Synchronisation cloud de base",
        "Invites guidées (voix)"
      ],
      premiumFeatures: [
        "Réécriture IA (ton ghostwriter)",
        "Export PDF (mise en page livre)",
        "Jusqu’à 2 h / mois de transcription"
      ],
      familyFeatures: [
        "Toutes les fonctions Premium",
        "Partage avec 4 membres (lecture & écoute)",
        "Bibliothèque familiale"
      ],
      exclusiveFeatures: [
        "Toutes les fonctions Famille",
        "Jusqu’à 5 h / mois de transcription",
        "Support prioritaire"
      ],
      choosePlan: "Choisir l’offre",

      // Record
      recTitle: "Enregistrer",
      lblGuided: "Invites suggérées aujourd’hui",
      btnSuggestOther: "Suggérer d’autres invites",
      lblNotes: "Notes (optionnel)",
      phNotes: "Ajouter une note…",
      lblTitle: "Titre",
      phTitle: "Titre de l’histoire",
      lblWhen: "Quand cela s’est-il passé ?",
      phWhen: "p. ex. « été 1945 », « début 2018 », « 15 fév. 1972 »",
      lblPhoto: "Ajouter une photo (optionnel)",
      lblTranscript: "Transcription",
      btnRecord: "Enregistrer",
      btnStop: "Arrêter",
      asrRecording:
        "Enregistrement… la transcription s’affichera en ligne.",
      asrListening: "Écoute…",
      asrOffline:
        "Hors ligne ou serveur indisponible — l’audio sera enregistré et envoyé plus tard.",
      errMic: "Accès au micro refusé.",
      defaultStory: "Histoire",
      errNoTranscript:
        "Pas encore de transcription. Dites quelques mots puis réessayez.",
      okSaved: "Enregistré ! Retrouvez-la dans Mes histoires.",
      errSave:
        "Échec de l’enregistrement. Hors ligne, un nouvel essai sera fait.",

      // Stories
      storiesTitle: "Mes histoires",
      storiesEmpty: "Aucune histoire pour le moment.",
      storiesCount: "Histoires",
      storiesSharedWith: "Membres partagés",
      storiesShareInvite: "Partager avec une adresse e-mail"
    },

    nl: {
      // Header
      brandTitle: "MEMOIR APP",
      brandTagline: "Bewaar je herinneringen voor altijd",
      navHome: "Home",
      navLogin: "Inloggen",
      navRecord: "Opnemen",
      navStories: "Mijn verhalen",
      langEnglish: "Engels",
      langFrench: "Frans",
      langDutch: "Nederlands",
      langSpanish: "Spaans",

      // Landing
      heroTitleA: "Bewaar je",
      heroTitleB: "herinneringen voor altijd",
      heroBlurb:
        "Neem één keer op en bewaar het voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.",
      startRecording: "Opname starten",
      viewStories: "Mijn verhalen",

      // 3 points
      feat1Title: "Vastleggen met één tik",
      feat1Desc:
        "Een warme, eenvoudige recorder met zachte suggesties. Spreek gewoon; wij transcriberen en ordenen.",
      feat2Title: "Georganiseerd voor een toekomstig boek",
      feat2Desc:
        "Voeg “wanneer het gebeurde” toe, koppel een foto en exporteer later naar een nette opmaak.",
      feat3Title: "Standaard privé, deel wanneer je wil",
      feat3Desc:
        "Jouw verhalen zijn van jou. Deel met familieleden die je uitnodigt — desnoods alleen-lezen.",

      // Pricing
      pricingTitle: "Prijzen",
      planFree: "Gratis",
      planPremium: "Premium",
      planFamily: "Familie",
      planExclusive: "Exclusief",
      priceFree: "€0 / maand",
      pricePremium: "€4,99 / maand",
      priceFamily: "€7,99 / maand",
      priceExclusive: "€14,99 / maand",
      freeFeatures: [
        "Onbeperkt lokaal opnemen",
        "Basis cloud-sync",
        "Geleide suggesties (stem)"
      ],
      premiumFeatures: [
        "AI-herschrijven (ghostwriter-toon)",
        "Export naar PDF (boekopmaak)",
        "Tot 2 uur / maand transcriptie"
      ],
      familyFeatures: [
        "Alle Premium-functionaliteit",
        "Delen met 4 leden (lezen & luisteren)",
        "Familiebibliotheek"
      ],
      exclusiveFeatures: [
        "Alle Familie-functionaliteit",
        "Tot 5 uur / maand transcriptie",
        "Prioritaire support"
      ],
      choosePlan: "Kies abonnement",

      // Record
      recTitle: "Opnemen",
      lblGuided: "Vandaag voorgestelde onderwerpen",
      btnSuggestOther: "Stel andere onderwerpen voor",
      lblNotes: "Notities (optioneel)",
      phNotes: "Voeg een korte notitie toe…",
      lblTitle: "Titel",
      phTitle: "Titel van het verhaal",
      lblWhen: "Wanneer gebeurde dit?",
      phWhen: "bv. \"zomer 1945\", \"begin 2018\", \"15 feb. 1972\"",
      lblPhoto: "Foto toevoegen (optioneel)",
      lblTranscript: "Transcriptie",
      btnRecord: "Opnemen",
      btnStop: "Stoppen",
      asrRecording:
        "Opname bezig… transcriptie verschijnt live wanneer online.",
      asrListening: "Luisteren…",
      asrOffline:
        "Offline of server niet bereikbaar — audio wordt lokaal bewaard en later verzonden.",
      errMic: "Microfoontoegang geweigerd.",
      defaultStory: "Verhaal",
      errNoTranscript:
        "Nog geen transcriptie. Zeg enkele woorden en probeer opnieuw.",
      okSaved: "Bewaard! Je vindt het bij Mijn verhalen.",
      errSave:
        "Bewaren mislukt. Offline wordt later opnieuw geprobeerd.",

      // Stories
      storiesTitle: "Mijn verhalen",
      storiesEmpty: "Nog geen verhalen.",
      storiesCount: "Verhalen",
      storiesSharedWith: "Gedeelde familieleden",
      storiesShareInvite: "Delen met een e-mailadres"
    },

    es: {
      // Header
      brandTitle: "MEMOIR APP",
      brandTagline: "Conserva tus recuerdos para siempre",
      navHome: "Inicio",
      navLogin: "Iniciar sesión",
      navRecord: "Grabar",
      navStories: "Mis historias",
      langEnglish: "Inglés",
      langFrench: "Francés",
      langDutch: "Neerlandés",
      langSpanish: "Español",

      // Landing
      heroTitleA: "Conserva tus",
      heroTitleB: "recuerdos para siempre",
      heroBlurb:
        "Graba una vez y guárdalo para generaciones. Inicia con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura con tu familia.",
      startRecording: "Comenzar a grabar",
      viewStories: "Mis historias",

      // 3 points
      feat1Title: "Captura con un toque",
      feat1Desc:
        "Grabadora cálida y sencilla con indicaciones suaves. Habla natural; transcribimos y organizamos.",
      feat2Title: "Preparado para un libro",
      feat2Desc:
        "Añade “cuándo ocurrió”, adjunta una foto y exporta a un diseño limpio.",
      feat3Title: "Privado por defecto, comparte cuando quieras",
      feat3Desc:
        "Tus historias son tuyas. Compártelas con familiares invitados — incluso solo lectura.",

      // Pricing
      pricingTitle: "Precios",
      planFree: "Gratis",
      planPremium: "Premium",
      planFamily: "Familiar",
      planExclusive: "Exclusivo",
      priceFree: "0 € / mes",
      pricePremium: "4,99 € / mes",
      priceFamily: "7,99 € / mes",
      priceExclusive: "14,99 € / mes",
      freeFeatures: [
        "Grabación local ilimitada",
        "Sincronización básica en la nube",
        "Indicaciones guiadas (voz)"
      ],
      premiumFeatures: [
        "Reescritura con IA (tono de escritor fantasma)",
        "Exportación a PDF (formato libro)",
        "Hasta 2 horas / mes de transcripción"
      ],
      familyFeatures: [
        "Todas las funciones Premium",
        "Compartir con hasta 4 miembros (leer y escuchar)",
        "Biblioteca familiar"
      ],
      exclusiveFeatures: [
        "Todas las funciones Familiar",
        "Hasta 5 horas / mes de transcripción",
        "Soporte prioritario"
      ],
      choosePlan: "Elegir plan",

      // Record
      recTitle: "Grabar",
      lblGuided: "Indicaciones sugeridas de hoy",
      btnSuggestOther: "Sugerir otras indicaciones",
      lblNotes: "Notas (opcional)",
      phNotes: "Añadir una nota rápida…",
      lblTitle: "Título",
      phTitle: "Título de la historia",
      lblWhen: "¿Cuándo ocurrió?",
      phWhen: "p. ej. \"verano de 1945\", \"inicios de 2018\", \"15 feb. 1972\"",
      lblPhoto: "Añadir foto (opcional)",
      lblTranscript: "Transcripción",
      btnRecord: "Grabar",
      btnStop: "Detener",
      asrRecording:
        "Grabando… la transcripción aparecerá en línea cuando haya conexión.",
      asrListening: "Escuchando…",
      asrOffline:
        "Sin conexión o servidor no disponible — el audio se guardará localmente y se enviará después.",
      errMic: "Permiso de micrófono denegado.",
      defaultStory: "Historia",
      errNoTranscript:
        "Aún no hay transcripción. Di unas palabras y vuelve a intentar.",
      okSaved: "¡Guardado! Encuéntralo en Mis historias.",
      errSave:
        "Fallo al guardar. Si estás sin conexión, se reintentará más tarde.",

      // Stories
      storiesTitle: "Mis historias",
      storiesEmpty: "Aún no hay historias.",
      storiesCount: "Historias",
      storiesSharedWith: "Familiares compartidos",
      storiesShareInvite: "Compartir con una dirección de correo"
    }
  };

  function readLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && strings[stored]) return stored;
    return DEFAULT_LANG;
  }

  function writeLang(code) {
    localStorage.setItem(STORAGE_KEY, code);
  }

  function t(key) {
    const code = readLang();
    const pack = strings[code] || strings[DEFAULT_LANG];
    // dot-path support if needed (e.g. "pricing.title")
    if (key.includes('.')) {
      const parts = key.split('.');
      let cur = pack;
      for (const p of parts) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
          cur = cur[p];
        } else {
          cur = null; break;
        }
      }
      if (cur != null) return cur;
      // fallback to English
      let curEn = strings[DEFAULT_LANG];
      for (const p of parts) {
        if (curEn && Object.prototype.hasOwnProperty.call(curEn, p)) {
          curEn = curEn[p];
        } else {
          curEn = null; break;
        }
      }
      return curEn ?? key;
    }
    return pack[key] ?? strings[DEFAULT_LANG][key] ?? key;
  }

  function setLang(code) {
    if (!strings[code]) code = DEFAULT_LANG;
    writeLang(code);
    // Let pages update themselves
    const evt = new CustomEvent('memoir:lang', { detail: { code } });
    window.dispatchEvent(evt);
  }

  function getLang() {
    return readLang();
  }

  // Expose
  window.MEMOIR_I18N = { strings, t, setLang, getLang };

  // Fire once on load so pages apply current language immediately
  document.addEventListener('DOMContentLoaded', () => {
    const code = readLang();
    const evt = new CustomEvent('memoir:lang', { detail: { code } });
    window.dispatchEvent(evt);
  });
})();
