(function () {
  // ---- Helper: persist language in localStorage
  const KEY = "memoir_lang";
  function getLang() {
    const urlParam = new URLSearchParams(location.search).get("lang");
    if (urlParam) {
      localStorage.setItem(KEY, urlParam);
      return urlParam;
    }
    return localStorage.getItem(KEY) || (navigator.language || "en").slice(0, 2) || "en";
  }
  function setLang(code) {
    localStorage.setItem(KEY, code);
    // let listeners know
    window.dispatchEvent(new CustomEvent("memoir:lang", { detail: { code } }));
  }
  function t(code) {
    const L = window.MEMOIR_I18N.strings[code] || window.MEMOIR_I18N.strings.en;
    return L;
  }

  // ========= All translatable strings =========
  const strings = {
    /* ================= EN ================= */
    en: {
      // ---- Global / Nav
      appName: "MEMOIR APP",
      appTagline: "Preserve your memories forever",
      navHome: "Home",
      navLogin: "Login",
      navRecord: "Record",
      navStories: "My Stories",
      navSettings: "Settings",

      // ---- Plan Names (edit these if you want nicer names)
      planFreeName: "Free",
      planPremiumName: "Storyteller",        // was “Premium”
      planFamilyName: "Family Library",       // was “Family”
      planExclusiveName: "Storyteller Pro",   // was “Exclusive”

      // ---- Prices (EUR)
      pricePremium: "€6.99 / month",
      priceFamily: "€8.99 / month",
      priceExclusive: "€11.99 / month",

      // ---- Landing (hero + CTAs)
      landingKicker: "MEMOIR APP",
      landingHeroTitleA: "Preserve Your",
      landingHeroTitleB: "Memories Forever",
      landingHeroBlurb:
        "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      ctaStart: "Start Recording",
      ctaStories: "My Stories",

      // ---- Action cards next to hero image
      actionStartTitle: "Start Recording",
      actionStartCopy: "One tap to begin. Add a title and “when it happened” later.",
      actionStoriesTitle: "My Stories",
      actionStoriesCopy: "Browse, rewrite with AI, export, and share with your family.",

      // ---- Features (Why Memoir)
      whyTitle: "Why Memoir",
      feat1Title: "Capture in one tap",
      feat1Copy:
        "Pick a gentle prompt or speak freely — Memoir records your voice in high quality and keeps everything organized as a story.",
      feat2Title: "Ready for a family book",
      feat2Copy:
        "Whisper-based transcription turns your words into clean text; you can fix little typos and add a time or season later.",
      feat3Title: "Private by default",
      feat3Copy:
        "Your stories stay in your private library. Share read-only access with family when you’re ready — across all devices.",

      // ---- Pricing section (cards)
      pricingTitle: "Pricing",
      priceCardFreeName: "@:en.planFreeName",
      priceCardFreePrice: "€0",
      priceCardFreeBul1: "Up to 10 stories",
      priceCardFreeBul2: "Max 2 minutes of transcription each",
      priceCardFreeBul3: "Private library on all your devices",

      priceCardPremiumName: "@:en.planPremiumName",
      priceCardPremiumPrice: "@:en.pricePremium",
      priceCardPremiumBul1: "Up to 2.5 hours per month of AI transcription",
      priceCardPremiumBul2: "Smart rewrite, export to PDF/CSV",
      priceCardPremiumBul3: "Priority processing",

      priceCardFamilyName: "@:en.planFamilyName",
      priceCardFamilyPrice: "@:en.priceFamily",
      priceCardFamilyBul1: "Includes Storyteller features",
      priceCardFamilyBul2: "Share your library with up to 4 read-only family members",
      priceCardFamilyBul3: "Invite via email; revoke anytime",

      priceCardExclusiveName: "@:en.planExclusiveName",
      priceCardExclusivePrice: "@:en.priceExclusive",
      priceCardExclusiveBul1: "Up to 5 hours per month of AI transcription + rewrite",
      priceCardExclusiveBul2: "Family sharing (up to 4)",
      priceCardExclusiveBul3: "Best for active storytellers",

      btnUpgrade: "Upgrade",

      // ---- Footer
      footAboutTitle: "About",
      footAboutCopy:
        "Memoir helps families capture life stories with beautiful voice capture, AI transcription, and a private library.",
      footLegal: "Legal & Policies",

      // ---- Record page
      recordTitle: "Record",
      recordTimer: "00:00",
      recordNotesLabel: "Notes (optional)",
      recordNotesPH: "Add a quick note…",
      recordTitleLabel: "Title",
      recordTitlePH: "Story title",
      recordWhenLabel: "When did this happen?",
      recordWhenPH: 'e.g. "summer 1945", "early 2018", "15 Feb 1972"',
      recordPhotoLabel: "Add photo (optional)",
      recordTranscriptLabel: "Transcript",
      recordTranscriptPH: "Your words will appear here…",
      recordSave: "Save story",
      recordMyStories: "My Stories",
      recordSuggest: "Suggest other prompts",
      recordFree: "Free",
      recordGuided: "Guided",
      recordOther: "Other",

      // Guided topics (shown as chips)
      topics: [
        "Childhood",
        "Family",
        "School",
        "Work",
        "Love",
        "War",
        "Travel",
        "Traditions",
        "Holidays",
        "Lessons",
        "Advice",
        "Turning points",
      ],
      // Voice guidance (ElevenLabs text)
      voiceLeadIn:
        "When you’re ready, start with a few details. You can pause any time and continue later.",
      voiceSamplePrompts: [
        "Tell me about a family celebration you’ll never forget.",
        "Who helped you through a difficult time, and how?",
        "What smells or sounds instantly take you back to childhood?",
        "Describe the place you felt most at home.",
      ],

      // ---- Stories page
      storiesTitle: "My Stories",
      storiesBlurb:
        "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      storiesCountLabel: "Stories",
      storiesFamilyCountLabel: "Family Members",
      storiesInvitePH: "email@example.com",
      storiesInviteBtn: "Invite",
      storiesEmpty: "No stories yet. Start your first recording!",

      // ---- Settings page
      stgTitle: "Settings",
      acctTitle: "Account",
      acctDesc: "Manage your login and personal settings.",
      acctStatusLbl: "Status",
      btnSignIn: "Sign in",
      btnSignOut: "Sign out",
      signedOut: "Signed out",
      signedIn: "Signed in",

      subTitle: "Subscription",
      planLabel: "Current plan",
      subNext: "Next billing:",
      btnManageBilling: "Manage billing",
      subNote:
        "Billed monthly. Cancel anytime from the billing portal. Sharing gives read-only access to your library.",

      legalTitle: "Legal",
      linkPrivacy: "Privacy Policy",
      linkTerms: "Terms of Service",
    },

    /* ================= FR ================= */
    fr: {
      appName: "MEMOIR APP",
      appTagline: "Préservez vos souvenirs pour toujours",
      navHome: "Accueil",
      navLogin: "Connexion",
      navRecord: "Enregistrer",
      navStories: "Mes histoires",
      navSettings: "Réglages",

      planFreeName: "Gratuit",
      planPremiumName: "Conteur",
      planFamilyName: "Bibliothèque familiale",
      planExclusiveName: "Conteur Pro",

      pricePremium: "6,99 € / mois",
      priceFamily: "8,99 € / mois",
      priceExclusive: "11,99 € / mois",

      landingKicker: "MEMOIR APP",
      landingHeroTitleA: "Préservez vos",
      landingHeroTitleB: "souvenirs pour toujours",
      landingHeroBlurb:
        "Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et « quand c’est arrivé », puis partagez en toute sécurité avec votre famille.",
      ctaStart: "Commencer",
      ctaStories: "Mes histoires",

      actionStartTitle: "Commencer l’enregistrement",
      actionStartCopy:
        "Un geste pour démarrer. Ajoutez un titre et « quand c’est arrivé » plus tard.",
      actionStoriesTitle: "Mes histoires",
      actionStoriesCopy:
        "Parcourez, réécrivez avec l’IA, exportez et partagez avec votre famille.",

      whyTitle: "Pourquoi Memoir",
      feat1Title: "Capturer en un geste",
      feat1Copy:
        "Choisissez une invite douce ou parlez librement — Memoir enregistre votre voix en haute qualité et organise tout en histoire.",
      feat2Title: "Prêt pour un livre de famille",
      feat2Copy:
        "La transcription Whisper produit un texte propre ; vous pouvez corriger les petites fautes et ajouter une date ou une saison.",
      feat3Title: "Privé par défaut",
      feat3Copy:
        "Vos histoires restent dans votre bibliothèque privée. Accès en lecture seule pour la famille, quand vous le décidez, sur tous les appareils.",

      pricingTitle: "Tarifs",
      priceCardFreeName: "@:fr.planFreeName",
      priceCardFreePrice: "0 €",
      priceCardFreeBul1: "Jusqu’à 10 histoires",
      priceCardFreeBul2: "2 minutes de transcription max chacune",
      priceCardFreeBul3: "Bibliothèque privée sur tous vos appareils",

      priceCardPremiumName: "@:fr.planPremiumName",
      priceCardPremiumPrice: "@:fr.pricePremium",
      priceCardPremiumBul1: "Jusqu’à 2,5 h / mois de transcription IA",
      priceCardPremiumBul2: "Réécriture intelligente, export PDF/CSV",
      priceCardPremiumBul3: "Traitement prioritaire",

      priceCardFamilyName: "@:fr.planFamilyName",
      priceCardFamilyPrice: "@:fr.priceFamily",
      priceCardFamilyBul1: "Inclut les fonctions Conteur",
      priceCardFamilyBul2:
        "Partagez votre bibliothèque avec jusqu’à 4 membres en lecture seule",
      priceCardFamilyBul3: "Invitation par e-mail ; révocation à tout moment",

      priceCardExclusiveName: "@:fr.planExclusiveName",
      priceCardExclusivePrice: "@:fr.priceExclusive",
      priceCardExclusiveBul1:
        "Jusqu’à 5 h / mois de transcription IA + réécriture",
      priceCardExclusiveBul2: "Partage familial (jusqu’à 4)",
      priceCardExclusiveBul3: "Idéal pour les conteurs actifs",

      btnUpgrade: "Passer à l’offre supérieure",

      footAboutTitle: "À propos",
      footAboutCopy:
        "Memoir aide les familles à capturer leurs histoires de vie avec une belle prise de voix, la transcription IA et une bibliothèque privée.",
      footLegal: "Mentions légales & politiques",

      recordTitle: "Enregistrer",
      recordTimer: "00:00",
      recordNotesLabel: "Notes (facultatif)",
      recordNotesPH: "Ajoutez une note rapide…",
      recordTitleLabel: "Titre",
      recordTitlePH: "Titre de l’histoire",
      recordWhenLabel: "Quand cela s’est-il produit ?",
      recordWhenPH: 'ex. « été 1945 », « début 2018 », « 15 févr 1972 »',
      recordPhotoLabel: "Ajouter une photo (facultatif)",
      recordTranscriptLabel: "Transcription",
      recordTranscriptPH: "Vos mots apparaîtront ici…",
      recordSave: "Enregistrer l’histoire",
      recordMyStories: "Mes histoires",
      recordSuggest: "Suggérer d’autres invites",
      recordFree: "Libre",
      recordGuided: "Guidé",
      recordOther: "Autre",

      topics: [
        "Enfance",
        "Famille",
        "École",
        "Travail",
        "Amour",
        "Guerre",
        "Voyages",
        "Traditions",
        "Fêtes",
        "Leçons",
        "Conseils",
        "Déclics",
      ],
      voiceLeadIn:
        "Quand vous êtes prêt, commencez avec quelques détails. Vous pouvez faire une pause et reprendre plus tard.",
      voiceSamplePrompts: [
        "Racontez une fête de famille inoubliable.",
        "Qui vous a aidé dans un moment difficile, et comment ?",
        "Quelles odeurs ou quels sons vous ramènent à l’enfance ?",
        "Décrivez l’endroit où vous vous sentiez le plus chez vous.",
      ],

      storiesTitle: "Mes histoires",
      storiesBlurb:
        "Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et « quand c’est arrivé », puis partagez en toute sécurité avec votre famille.",
      storiesCountLabel: "Histoires",
      storiesFamilyCountLabel: "Membres de la famille",
      storiesInvitePH: "email@example.com",
      storiesInviteBtn: "Inviter",
      storiesEmpty: "Pas encore d’histoire. Lancez votre premier enregistrement !",

      stgTitle: "Réglages",
      acctTitle: "Compte",
      acctDesc: "Gérez votre connexion et vos préférences.",
      acctStatusLbl: "Statut",
      btnSignIn: "Se connecter",
      btnSignOut: "Se déconnecter",
      signedOut: "Déconnecté",
      signedIn: "Connecté",

      subTitle: "Abonnement",
      planLabel: "Offre actuelle",
      subNext: "Prochaine facturation :",
      btnManageBilling: "Gérer la facturation",
      subNote:
        "Facturation mensuelle. Résiliation possible à tout moment via le portail. Le partage donne un accès en lecture seule.",

      legalTitle: "Mentions légales",
      linkPrivacy: "Politique de confidentialité",
      linkTerms: "Conditions d’utilisation",
    },

    /* ================= NL ================= */
    nl: {
      appName: "MEMOIR APP",
      appTagline: "Bewaar je herinneringen voor altijd",
      navHome: "Home",
      navLogin: "Inloggen",
      navRecord: "Opnemen",
      navStories: "Mijn verhalen",
      navSettings: "Instellingen",

      planFreeName: "Gratis",
      planPremiumName: "Verteller",
      planFamilyName: "Familiebibliotheek",
      planExclusiveName: "Verteller Pro",

      pricePremium: "€6,99 / maand",
      priceFamily: "€8,99 / maand",
      priceExclusive: "€11,99 / maand",

      landingKicker: "MEMOIR APP",
      landingHeroTitleA: "Bewaar je",
      landingHeroTitleB: "herinneringen voor altijd",
      landingHeroBlurb:
        "Neem één keer op en bewaar het voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.",
      ctaStart: "Opname starten",
      ctaStories: "Mijn verhalen",

      actionStartTitle: "Opname starten",
      actionStartCopy:
        "Eén tik om te beginnen. Voeg later een titel en “wanneer” toe.",
      actionStoriesTitle: "Mijn verhalen",
      actionStoriesCopy:
        "Blader, herschrijf met AI, exporteer en deel met je familie.",

      whyTitle: "Waarom Memoir",
      feat1Title: "Vastleggen met één tik",
      feat1Copy:
        "Kies een zachte prompt of spreek vrijuit — Memoir neemt je stem in hoge kwaliteit op en ordent alles als een verhaal.",
      feat2Title: "Klaar voor een familieboek",
      feat2Copy:
        "Whisper-transcriptie maakt nette tekst; je kunt later kleine foutjes verbeteren en een tijd of seizoen toevoegen.",
      feat3Title: "Standaard privé",
      feat3Copy:
        "Je verhalen blijven in je privébibliotheek. Deel leesrechten met familie wanneer jij dat wilt — op al je apparaten.",

      pricingTitle: "Prijzen",
      priceCardFreeName: "@:nl.planFreeName",
      priceCardFreePrice: "€0",
      priceCardFreeBul1: "Tot 10 verhalen",
      priceCardFreeBul2: "Max. 2 minuten transcriptie per verhaal",
      priceCardFreeBul3: "Privébibliotheek op al je apparaten",

      priceCardPremiumName: "@:nl.planPremiumName",
      priceCardPremiumPrice: "@:nl.pricePremium",
      priceCardPremiumBul1: "Tot 2,5 uur AI-transcriptie per maand",
      priceCardPremiumBul2: "Slim herschrijven, export naar PDF/CSV",
      priceCardPremiumBul3: "Prioriteitsverwerking",

      priceCardFamilyName: "@:nl.planFamilyName",
      priceCardFamilyPrice: "@:nl.priceFamily",
      priceCardFamilyBul1: "Inclusief functies van Verteller",
      priceCardFamilyBul2:
        "Deel je bibliotheek met maximaal 4 familieleden (alleen lezen)",
      priceCardFamilyBul3: "Uitnodigen via e-mail; op elk moment intrekken",

      priceCardExclusiveName: "@:nl.planExclusiveName",
      priceCardExclusivePrice: "@:nl.priceExclusive",
      priceCardExclusiveBul1:
        "Tot 5 uur AI-transcriptie + herschrijven per maand",
      priceCardExclusiveBul2: "Familiedeling (tot 4)",
      priceCardExclusiveBul3: "Beste keuze voor actieve vertellers",

      btnUpgrade: "Upgrade",

      footAboutTitle: "Over",
      footAboutCopy:
        "Memoir helpt families levensverhalen vast te leggen met prachtige stemopname, AI-transcriptie en een privébibliotheek.",
      footLegal: "Juridisch & beleid",

      recordTitle: "Opnemen",
      recordTimer: "00:00",
      recordNotesLabel: "Notities (optioneel)",
      recordNotesPH: "Snel een notitie toevoegen…",
      recordTitleLabel: "Titel",
      recordTitlePH: "Verhaaltitel",
      recordWhenLabel: "Wanneer gebeurde dit?",
      recordWhenPH: 'bv. "zomer 1945", "begin 2018", "15 feb 1972"',
      recordPhotoLabel: "Foto toevoegen (optioneel)",
      recordTranscriptLabel: "Transcript",
      recordTranscriptPH: "Je woorden verschijnen hier…",
      recordSave: "Verhaal opslaan",
      recordMyStories: "Mijn verhalen",
      recordSuggest: "Andere prompts voorstellen",
      recordFree: "Vrij",
      recordGuided: "Geleid",
      recordOther: "Anders",

      topics: [
        "Jeugd",
        "Familie",
        "School",
        "Werk",
        "Liefde",
        "Oorlog",
        "Reizen",
        "Tradities",
        "Feestdagen",
        "Lessen",
        "Advies",
        "Keerpunt",
      ],
      voiceLeadIn:
        "Als je klaar bent, begin met een paar details. Je kunt pauzeren en later doorgaan.",
      voiceSamplePrompts: [
        "Vertel over een familieviering die je nooit vergeet.",
        "Wie hielp je door een moeilijke tijd, en hoe?",
        "Welke geuren of geluiden brengen je terug naar je jeugd?",
        "Beschrijf de plek waar je je het meest thuis voelde.",
      ],

      storiesTitle: "Mijn verhalen",
      storiesBlurb:
        "Neem één keer op en bewaar het voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.",
      storiesCountLabel: "Verhalen",
      storiesFamilyCountLabel: "Familieleden",
      storiesInvitePH: "email@example.com",
      storiesInviteBtn: "Uitnodigen",
      storiesEmpty: "Nog geen verhalen. Start je eerste opname!",

      stgTitle: "Instellingen",
      acctTitle: "Account",
      acctDesc: "Beheer je login en persoonlijke instellingen.",
      acctStatusLbl: "Status",
      btnSignIn: "Inloggen",
      btnSignOut: "Uitloggen",
      signedOut: "Uitgelogd",
      signedIn: "Ingelogd",

      subTitle: "Abonnement",
      planLabel: "Huidig abonnement",
      subNext: "Volgende betaling:",
      btnManageBilling: "Facturatie beheren",
      subNote:
        "Maandelijks gefactureerd. Op elk moment opzegbaar via het facturatieportaal. Delen geeft alleen-lezen toegang.",

      legalTitle: "Juridisch",
      linkPrivacy: "Privacybeleid",
      linkTerms: "Servicevoorwaarden",
    },

    /* ================= ES ================= */
    es: {
      appName: "MEMOIR APP",
      appTagline: "Preserva tus recuerdos para siempre",
      navHome: "Inicio",
      navLogin: "Entrar",
      navRecord: "Grabar",
      navStories: "Mis historias",
      navSettings: "Ajustes",

      planFreeName: "Gratis",
      planPremiumName: "Narrador",
      planFamilyName: "Biblioteca familiar",
      planExclusiveName: "Narrador Pro",

      pricePremium: "6,99 € / mes",
      priceFamily: "8,99 € / mes",
      priceExclusive: "11,99 € / mes",

      landingKicker: "MEMOIR APP",
      landingHeroTitleA: "Preserva tus",
      landingHeroTitleB: "recuerdos para siempre",
      landingHeroBlurb:
        "Graba una vez y consérvalo por generaciones. Empieza con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura con tu familia.",
      ctaStart: "Empezar a grabar",
      ctaStories: "Mis historias",

      actionStartTitle: "Empezar a grabar",
      actionStartCopy:
        "Un toque para comenzar. Añade título y “cuándo ocurrió” más tarde.",
      actionStoriesTitle: "Mis historias",
      actionStoriesCopy:
        "Explora, reescribe con IA, exporta y comparte con tu familia.",

      whyTitle: "Por qué Memoir",
      feat1Title: "Captura con un toque",
      feat1Copy:
        "Elige una sugerencia suave o habla libremente — Memoir graba tu voz con gran calidad y organiza todo como una historia.",
      feat2Title: "Listo para un libro familiar",
      feat2Copy:
        "La transcripción con Whisper convierte tus palabras en texto limpio; puedes corregir detalles y añadir una fecha o estación.",
      feat3Title: "Privado por defecto",
      feat3Copy:
        "Tus historias permanecen en tu biblioteca privada. Comparte acceso de solo lectura cuando estés listo — en todos tus dispositivos.",

      pricingTitle: "Precios",
      priceCardFreeName: "@:es.planFreeName",
      priceCardFreePrice: "0 €",
      priceCardFreeBul1: "Hasta 10 historias",
      priceCardFreeBul2: "Máx. 2 minutos de transcripción cada una",
      priceCardFreeBul3: "Biblioteca privada en todos tus dispositivos",

      priceCardPremiumName: "@:es.planPremiumName",
      priceCardPremiumPrice: "@:es.pricePremium",
      priceCardPremiumBul1: "Hasta 2,5 h al mes de transcripción con IA",
      priceCardPremiumBul2: "Reescritura inteligente, exportación a PDF/CSV",
      priceCardPremiumBul3: "Procesamiento prioritario",

      priceCardFamilyName: "@:es.planFamilyName",
      priceCardFamilyPrice: "@:es.priceFamily",
      priceCardFamilyBul1: "Incluye funciones de Narrador",
      priceCardFamilyBul2:
        "Comparte tu biblioteca con hasta 4 familiares (solo lectura)",
      priceCardFamilyBul3: "Invita por correo; revoca cuando quieras",

      priceCardExclusiveName: "@:es.planExclusiveName",
      priceCardExclusivePrice: "@:es.priceExclusive",
      priceCardExclusiveBul1:
        "Hasta 5 h al mes de transcripción con IA + reescritura",
      priceCardExclusiveBul2: "Uso familiar (hasta 4)",
      priceCardExclusiveBul3: "Perfecto para narradores activos",

      btnUpgrade: "Mejorar plan",

      footAboutTitle: "Acerca de",
      footAboutCopy:
        "Memoir ayuda a las familias a capturar historias de vida con una hermosa captura de voz, transcripción con IA y una biblioteca privada.",
      footLegal: "Legal y políticas",

      recordTitle: "Grabar",
      recordTimer: "00:00",
      recordNotesLabel: "Notas (opcional)",
      recordNotesPH: "Añade una nota rápida…",
      recordTitleLabel: "Título",
      recordTitlePH: "Título de la historia",
      recordWhenLabel: "¿Cuándo ocurrió?",
      recordWhenPH: 'p. ej. "verano de 1945", "inicios de 2018", "15 feb 1972"',
      recordPhotoLabel: "Añadir foto (opcional)",
      recordTranscriptLabel: "Transcripción",
      recordTranscriptPH: "Tus palabras aparecerán aquí…",
      recordSave: "Guardar historia",
      recordMyStories: "Mis historias",
      recordSuggest: "Sugerir otras preguntas",
      recordFree: "Libre",
      recordGuided: "Guiado",
      recordOther: "Otro",

      topics: [
        "Infancia",
        "Familia",
        "Escuela",
        "Trabajo",
        "Amor",
        "Guerra",
        "Viajes",
        "Tradiciones",
        "Fiestas",
        "Lecciones",
        "Consejos",
        "Puntos clave",
      ],
      voiceLeadIn:
        "Cuando quieras, empieza con algunos detalles. Puedes pausar y continuar más tarde.",
      voiceSamplePrompts: [
        "Cuéntame una celebración familiar inolvidable.",
        "¿Quién te ayudó en un momento difícil, y cómo?",
        "¿Qué olores o sonidos te llevan a la infancia?",
        "Describe el lugar donde te sentiste más en casa.",
      ],

      storiesTitle: "Mis historias",
      storiesBlurb:
        "Graba una vez y consérvalo por generaciones. Empieza con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura con tu familia.",
      storiesCountLabel: "Historias",
      storiesFamilyCountLabel: "Miembros de la familia",
      storiesInvitePH: "email@example.com",
      storiesInviteBtn: "Invitar",
      storiesEmpty: "Aún no hay historias. ¡Empieza tu primera grabación!",

      stgTitle: "Ajustes",
      acctTitle: "Cuenta",
      acctDesc: "Administra tu inicio de sesión y preferencias.",
      acctStatusLbl: "Estado",
      btnSignIn: "Entrar",
      btnSignOut: "Salir",
      signedOut: "Desconectado",
      signedIn: "Conectado",

      subTitle: "Suscripción",
      planLabel: "Plan actual",
      subNext: "Próximo cobro:",
      btnManageBilling: "Gestionar facturación",
      subNote:
        "Cobro mensual. Puedes cancelar en cualquier momento desde el portal. Compartir da acceso de solo lectura.",

      legalTitle: "Legal",
      linkPrivacy: "Política de privacidad",
      linkTerms: "Términos del servicio",
    },
  };

  // small alias resolver like vue-i18n @:path
  function resolveAliases(obj, ns) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string" && v.startsWith("@:")) {
        const path = v.slice(2).split(".");
        let cur = strings;
        for (const seg of path) cur = cur?.[seg];
        out[k] = cur || v;
      } else out[k] = v;
    }
    return out;
  }
  for (const code of Object.keys(strings)) {
    strings[code] = resolveAliases(strings[code]);
  }

  // Public API
  window.MEMOIR_I18N = {
    getLang,
    setLang,
    strings,
    t, // not required, but handy if you want manual lookups
  };

  // Fire once on load with the current lang so pages can initialize
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("memoir:lang", { detail: { code: getLang() } }));
    }, 0);
  });
})();
