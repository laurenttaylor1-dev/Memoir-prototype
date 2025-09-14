// Global i18n helper for Memoir
// - Persists selection in localStorage ("memoir.lang")
// - Translates elements with data-i18n / data-i18n-attr
// - Falls back to English if a key/language is missing
// - Emits `memoir:lang` CustomEvent({detail:{code}})

(function () {
  const STORE_KEY = 'memoir.lang';
  const DEFAULT_LANG = 'en';

  // ---------------- Translations ----------------
  const strings = {
    en: {
      // Header
      navHome: 'Home',
      navLogin: 'Login',
      navRecord: 'Record',
      navStories: 'My Stories',
      navSettings: 'Settings',

      // Footer
      footerAbout: 'Memoir helps families capture life stories with beautiful voice capture, polished AI rewrites and a private library for all generations.',
      footerLegal: 'Legal & Policies',

      // Landing hero
      heroKicker: 'Memoir App',
      heroTitleA: 'Preserve Your',
      heroTitleB: 'Memories Forever',
      heroBlurb:
        'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',

      // Landing actions
      landingStartCardTitle: 'Start Recording',
      landingStartCardText:
        'One tap to begin. Add a title and “when it happened” later. Whisper AI transcribes clearly in your language.',
      landingStartBtn: 'Start Recording',
      landingStoriesCardTitle: 'View My Stories',
      landingStoriesCardText:
        'Browse your private library, attach photos, AI-rewrite for clarity, and export.',
      landingStoriesBtn: 'My Stories',

      // Why/Features
      featuresTitle: 'Why Memoir',
      featuresIntro: '',
      feat1Title: 'Accurate transcription',
      feat1Text:
        'Capture every word with Whisper-powered transcription for high accuracy and clarity.',
      feat2Title: 'AI rewrite for families',
      feat2Text:
        'Turn your spoken words into polished, engaging stories — like real literature your family will love to read.',
      feat3Title: 'Private or shared',
      feat3Text:
        'Keep stories private or share read-only with selected family members; everything syncs across your devices.',

      // Pricing (cards + CTA)
      priceTitle: 'Pricing',
      priceFreeTitle: 'Free',
      priceFreeBody: 'Up to 10 stories · Max 2 minutes of transcription each · Private library on all your devices',
      priceStorytellerTitle: 'Storyteller — €6.99/month',
      priceStorytellerBody: 'Up to 2.5 hours / month of AI transcription · AI Rewrite (polish stories), export to PDF/CSV · Priority processing',
      priceFamilyTitle: 'Family — €8.99/month',
      priceFamilyBody: 'Everything in Storyteller · Share your library with up to 4 read-only family members · Invite by email; revoke anytime',
      priceExclusiveTitle: 'Exclusive — €11.99/month',
      priceExclusiveBody: 'Up to 5 hours / month of AI transcription + rewrite · Family sharing (up to 4) · Best for active storytellers',
      priceChoose: 'Choose plan',

      // Record
      recordTitle: 'Record',
      recordSuggested: "Today's suggested prompts",
      recordSuggestOther: 'Suggest other prompts',
      recordNotes: 'Notes (optional)',
      recordSave: 'Save story',
      recordWhen: 'When did this happen?',
      recordWhenPH: 'e.g. “summer 1945”, “early 2018”, “15 Feb 1972”',
      recordTitleLabel: 'Title',
      recordTitlePH: 'Story title',
      recordTranscript: 'Transcript',
      recordMyStories: 'My Stories',
      recordFree: 'Free',
      recordGuided: 'Guided',

      // Stories
      storiesTitle: 'My Stories',
      storiesEmpty: 'Your stories will all be added to this private library.',
      storiesRewrite: 'AI Rewrite',
      storiesExport: 'Export',
      storiesDelete: 'Delete',

      // Settings
      settingsTitle: 'Settings',
      settingsAccount: 'Account',
      settingsLanguage: 'Language',
      settingsSubscription: 'Subscription',
      settingsSecurity: 'Security & Privacy',
      settingsHelp: 'Help & FAQ',
      settingsPlansDetail: 'Plans & Pricing',
    },

    fr: {
      navHome: 'Accueil', navLogin: 'Connexion', navRecord: 'Enregistrer', navStories: 'Mes histoires', navSettings: 'Paramètres',
      footerAbout: 'Memoir aide les familles à capturer les histoires de vie avec une belle prise de voix, des réécritures IA soignées et une bibliothèque privée pour toutes les générations.',
      footerLegal: 'Mentions légales',
      heroKicker: 'Application Memoir',
      heroTitleA: 'Préservez vos', heroTitleB: 'souvenirs pour toujours',
      heroBlurb:
        'Enregistrez une fois, gardez pour des générations. Lancez un enregistrement, ajoutez un titre et “quand c’est arrivé”, puis partagez en toute sécurité.',
      landingStartCardTitle: 'Commencer un enregistrement',
      landingStartCardText:
        'Un seul geste pour démarrer. Ajoutez le titre et “quand c’est arrivé” plus tard. Transcription Whisper claire dans votre langue.',
      landingStartBtn: 'Enregistrer',
      landingStoriesCardTitle: 'Voir mes histoires',
      landingStoriesCardText:
        'Parcourez votre bibliothèque privée, joignez des photos, réécrivez avec l’IA et exportez.',
      landingStoriesBtn: 'Mes histoires',
      featuresTitle: 'Pourquoi Memoir',
      featuresIntro: '',
      feat1Title: 'Transcription précise',
      feat1Text: 'Chaque mot, fidèlement, grâce à Whisper.',
      feat2Title: 'Réécriture IA pour la famille',
      feat2Text:
        'Transformez la parole en un texte chaleureux et lisible, digne d’un livre.',
      feat3Title: 'Privé ou partagé',
      feat3Text:
        'Gardez privé ou partagez en lecture seule avec des proches; synchronisé sur tous vos appareils.',
      priceTitle: 'Tarifs',
      priceFreeTitle: 'Gratuit',
      priceFreeBody: 'Jusqu’à 10 histoires · 2 min max par histoire · Bibliothèque privée sur tous vos appareils',
      priceStorytellerTitle: 'Conteur — 6,99 €/mois',
      priceStorytellerBody: 'Jusqu’à 2,5 h/mois de transcription IA · Réécriture IA, export PDF/CSV · Traitement prioritaire',
      priceFamilyTitle: 'Famille — 8,99 €/mois',
      priceFamilyBody: 'Tout Conteur · Partage avec 4 proches (lecture seule) · Invitation par email; révocation à tout moment',
      priceExclusiveTitle: 'Exclusive — 11,99 €/mois',
      priceExclusiveBody: 'Jusqu’à 5 h/mois de transcription + réécriture · Partage familial (jusqu’à 4) · Pour conteurs actifs',
      priceChoose: 'Choisir',
      recordTitle: 'Enregistrer',
      recordSuggested: 'Prompts suggérés du jour',
      recordSuggestOther: 'Suggérer d’autres prompts',
      recordNotes: 'Notes (facultatif)',
      recordSave: 'Enregistrer l’histoire',
      recordWhen: 'Quand cela est-il arrivé ?',
      recordWhenPH: 'ex. “été 1945”, “début 2018”, “15 fév. 1972”',
      recordTitleLabel: 'Titre',
      recordTitlePH: 'Titre de l’histoire',
      recordTranscript: 'Transcription',
      recordMyStories: 'Mes histoires',
      recordFree: 'Libre',
      recordGuided: 'Guidé',
      storiesTitle: 'Mes histoires',
      storiesEmpty: 'Vos histoires seront ajoutées à cette bibliothèque privée.',
      storiesRewrite: 'Réécrire (IA)',
      storiesExport: 'Exporter',
      storiesDelete: 'Supprimer',
      settingsTitle: 'Paramètres',
      settingsAccount: 'Compte',
      settingsLanguage: 'Langue',
      settingsSubscription: 'Abonnement',
      settingsSecurity: 'Sécurité & vie privée',
      settingsHelp: 'Aide & FAQ',
      settingsPlansDetail: 'Offres & tarifs',
    },

    nl: {
      navHome: 'Home', navLogin: 'Inloggen', navRecord: 'Opnemen', navStories: 'Mijn verhalen', navSettings: 'Instellingen',
      footerAbout: 'Memoir helpt families levensverhalen vast te leggen met mooie stemopname, verzorgde AI-herschrijvingen en een privébibliotheek voor alle generaties.',
      footerLegal: 'Juridisch & beleid',
      heroKicker: 'Memoir App',
      heroTitleA: 'Bewaar je', heroTitleB: 'herinneringen voor altijd',
      heroBlurb:
        'Neem één keer op, bewaar voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.',
      landingStartCardTitle: 'Start opname',
      landingStartCardText:
        'Met één tik beginnen. Titel en “wanneer” later. Whisper-transcriptie in jouw taal.',
      landingStartBtn: 'Opnemen',
      landingStoriesCardTitle: 'Bekijk mijn verhalen',
      landingStoriesCardText:
        'Blader door je privébibliotheek, voeg foto’s toe, herschrijf met AI en exporteer.',
      landingStoriesBtn: 'Mijn verhalen',
      featuresTitle: 'Waarom Memoir',
      featuresIntro: '',
      feat1Title: 'Nauwkeurige transcriptie',
      feat1Text: 'Elke zin betrouwbaar met Whisper.',
      feat2Title: 'AI-herschrijven voor familie',
      feat2Text:
        'Maak van gesproken tekst warm, leesbaar proza — boekwaardig.',
      feat3Title: 'Privé of gedeeld',
      feat3Text:
        'Houd privé of deel alleen-lezen met familie; synchronisatie op je apparaten.',
      priceTitle: 'Pakketten',
      priceFreeTitle: 'Gratis',
      priceFreeBody: 'Tot 10 verhalen · Max 2 min per verhaal · Privébibliotheek op al je apparaten',
      priceStorytellerTitle: 'Verteller — €6,99/mnd',
      priceStorytellerBody: 'Tot 2,5 uur/mnd transcriptie · AI-herschrijven, export PDF/CSV · Prioriteit',
      priceFamilyTitle: 'Familie — €8,99/mnd',
      priceFamilyBody: 'Alles van Verteller · Deel met 4 familieleden (alleen lezen) · Uitnodigen per e-mail; intrekken kan altijd',
      priceExclusiveTitle: 'Exclusief — €11,99/mnd',
      priceExclusiveBody: 'Tot 5 uur/mnd transcriptie + herschrijven · Familiedelen (tot 4) · Voor actieve vertellers',
      priceChoose: 'Kies abonnement',
      recordTitle: 'Opnemen',
      recordSuggested: 'Suggesties van vandaag',
      recordSuggestOther: 'Andere suggesties',
      recordNotes: 'Notities (optioneel)',
      recordSave: 'Verhaal opslaan',
      recordWhen: 'Wanneer gebeurde dit?',
      recordWhenPH: 'bv. “zomer 1945”, “begin 2018”, “15 feb 1972”',
      recordTitleLabel: 'Titel',
      recordTitlePH: 'Verhaaltitel',
      recordTranscript: 'Transcript',
      recordMyStories: 'Mijn verhalen',
      recordFree: 'Vrij',
      recordGuided: 'Geleid',
      storiesTitle: 'Mijn verhalen',
      storiesEmpty: 'Je verhalen worden hier in je privélibrary bewaard.',
      storiesRewrite: 'Herschrijf (AI)',
      storiesExport: 'Exporteer',
      storiesDelete: 'Verwijder',
      settingsTitle: 'Instellingen',
      settingsAccount: 'Account',
      settingsLanguage: 'Taal',
      settingsSubscription: 'Abonnement',
      settingsSecurity: 'Beveiliging & privacy',
      settingsHelp: 'Help & FAQ',
      settingsPlansDetail: 'Pakketten & prijzen',
    },

    es: {
      navHome: 'Inicio', navLogin: 'Acceso', navRecord: 'Grabar', navStories: 'Mis historias', navSettings: 'Ajustes',
      footerAbout: 'Memoir ayuda a las familias a capturar historias de vida con una hermosa captura de voz, reescrituras IA pulidas y una biblioteca privada para todas las generaciones.',
      footerLegal: 'Avisos legales',
      heroKicker: 'Aplicación Memoir',
      heroTitleA: 'Conserva tus', heroTitleB: 'recuerdos para siempre',
      heroBlurb:
        'Graba una vez y guarda para generaciones. Comienza con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura.',
      landingStartCardTitle: 'Comenzar a grabar',
      landingStartCardText:
        'Un toque para empezar. Título y fecha después. Transcripción Whisper clara en tu idioma.',
      landingStartBtn: 'Grabar',
      landingStoriesCardTitle: 'Ver mis historias',
      landingStoriesCardText:
        'Biblioteca privada, fotos, reescritura con IA y exportación.',
      landingStoriesBtn: 'Mis historias',
      featuresTitle: 'Por qué Memoir',
      featuresIntro: '',
      feat1Title: 'Transcripción precisa',
      feat1Text: 'Cada palabra con Whisper, con alta precisión.',
      feat2Title: 'Reescritura IA para familias',
      feat2Text:
        'Convierte tu voz en relatos pulidos y amenos — literatura familiar.',
      feat3Title: 'Privado o compartido',
      feat3Text:
        'Mantén privado o comparte de solo lectura con familia; todo se sincroniza en tus dispositivos.',
      priceTitle: 'Planes',
      priceFreeTitle: 'Gratis',
      priceFreeBody: 'Hasta 10 historias · Máx 2 min por historia · Biblioteca privada en todos tus dispositivos',
      priceStorytellerTitle: 'Narrador — 6,99 €/mes',
      priceStorytellerBody: 'Hasta 2,5 h/mes de transcripción · Reescritura IA, exportación PDF/CSV · Prioridad',
      priceFamilyTitle: 'Familiar — 8,99 €/mes',
      priceFamilyBody: 'Todo Narrador · Comparte con hasta 4 familiares (solo lectura) · Invita por correo; revoca cuando quieras',
      priceExclusiveTitle: 'Exclusivo — 11,99 €/mes',
      priceExclusiveBody: 'Hasta 5 h/mes de transcripción + reescritura · Compartir familiar (hasta 4) · Para narradores activos',
      priceChoose: 'Elegir plan',
      recordTitle: 'Grabar',
      recordSuggested: 'Sugerencias de hoy',
      recordSuggestOther: 'Sugerir otras',
      recordNotes: 'Notas (opcional)',
      recordSave: 'Guardar historia',
      recordWhen: '¿Cuándo ocurrió?',
      recordWhenPH: 'p.ej. “verano de 1945”, “principios de 2018”, “15 feb 1972”',
      recordTitleLabel: 'Título',
      recordTitlePH: 'Título de la historia',
      recordTranscript: 'Transcripción',
      recordMyStories: 'Mis historias',
      recordFree: 'Libre',
      recordGuided: 'Guiado',
      storiesTitle: 'Mis historias',
      storiesEmpty: 'Tus historias se añadirán a esta biblioteca privada.',
      storiesRewrite: 'Reescribir (IA)',
      storiesExport: 'Exportar',
      storiesDelete: 'Eliminar',
      settingsTitle: 'Ajustes',
      settingsAccount: 'Cuenta',
      settingsLanguage: 'Idioma',
      settingsSubscription: 'Suscripción',
      settingsSecurity: 'Seguridad y privacidad',
      settingsHelp: 'Ayuda y preguntas',
      settingsPlansDetail: 'Planes y precios',
    }
  };

  // ---------------- Helpers ----------------
  const getLang = () => localStorage.getItem(STORE_KEY) || DEFAULT_LANG;

  function t(key, code) {
    const lang = code || getLang();
    const pack = strings[lang] || strings[DEFAULT_LANG];
    return (pack && pack[key]) || (strings.en && strings.en[key]) || null;
  }

  function applyTranslations(code) {
    const lang = code || getLang();
    // data-i18n -> textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key, lang);
      if (val != null) el.textContent = val;
    });
    // data-i18n-attr="placeholder:key;title:key2"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr') || '';
      spec.split(';').forEach(entry => {
        const [attr, k] = entry.split(':').map(s => (s || '').trim());
        if (!attr || !k) return;
        const val = t(k, lang);
        if (val != null) el.setAttribute(attr, val);
      });
    });
  }

  function setLang(code) {
    const safe = strings[code] ? code : DEFAULT_LANG;
    localStorage.setItem(STORE_KEY, safe);
    applyTranslations(safe);
    window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code: safe } }));
  }

  // Expose
  window.MEMOIR_I18N = { strings, getLang, setLang, t, apply: applyTranslations };

  // Init after DOM is present
  document.addEventListener('DOMContentLoaded', () => {
    applyTranslations(getLang());
  });
})();
