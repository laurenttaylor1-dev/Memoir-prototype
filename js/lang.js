<script>
// Global i18n helper for Memoir
// - Persists selection in localStorage
// - Translates elements with data-i18n and data-i18n-attr
// - Never blanks content if a key is missing
// - Emits `memoir:lang` events on change

(function () {
  const STORE_KEY = 'memoir.lang';
  const DEFAULT_LANG = 'en';

  // ------- Translations -------
  const strings = {
    en: {
      // Header
      navHome: 'Home',
      navLogin: 'Login',
      navRecord: 'Record',
      navStories: 'My Stories',
      navSettings: 'Settings',

      // Footer
      footerAbout: 'Memoir is a gentle way to capture life stories and keep them safe for your family.',
      footerLegal: 'Legal & Policies',

      // Landing hero
      heroKicker: 'Memoir App',
      heroTitleA: 'Preserve Your',
      heroTitleB: 'Memories Forever',
      heroBlurb: 'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',

      // Landing actions (cards next to the photo)
      landingStartCardTitle: 'Start Recording',
      landingStartCardText: 'One tap to begin. Add a title and “when it happened” later. Whisper AI transcribes clearly in your language.',
      landingStartBtn: 'Start Recording',
      landingStoriesCardTitle: 'View My Stories',
      landingStoriesCardText: 'Browse your private library, attach photos, AI-rewrite for clarity, and export.',
      landingStoriesBtn: 'My Stories',

      // Features row
      featTitle1: 'Book-ready text',
      featText1: 'We combine accurate transcription with an optional AI rewrite that turns speech into warm, readable prose.',
      featTitle2: 'Private & simple sharing',
      featText2: 'Keep everything in your family’s private space and share read-only access with the people you choose.',
      featTitle3: 'Photos & dates',
      featText3: 'Attach photos and add “when it happened” so stories sort chronologically for easy book export.',

      // Pricing (titles / bullet labels / CTA)
      priceTitle: 'Plans',
      priceFreeTitle: 'Free',
      priceFreeBody: 'Basic recording, local library, up to a few minutes per story.',
      priceStorytellerTitle: 'Storyteller',
      priceStorytellerBody: '6.99 €/mo • Whisper transcription + AI rewrite, export tools.',
      priceFamilyTitle: 'Family',
      priceFamilyBody: '8.99 €/mo • Share with up to 4 family members (read/listen).',
      priceExclusiveTitle: 'Exclusive',
      priceExclusiveBody: '11.99 €/mo • Up to 5 hours of transcription per month.',
      priceChoose: 'Choose plan',

      // Record page
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

      // Stories page
      storiesTitle: 'My Stories',
      storiesEmpty: 'Your stories will all be added to this private library.',
      storiesRewrite: 'AI Rewrite',
      storiesExport: 'Export',
      storiesDelete: 'Delete',

      // Settings page (headings)
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
      footerAbout: 'Memoir est une façon douce de capturer les histoires de vie et de les garder en sécurité pour votre famille.',
      footerLegal: 'Mentions légales',
      heroKicker: 'Application Memoir',
      heroTitleA: 'Préservez vos', heroTitleB: 'souvenirs pour toujours',
      heroBlurb: 'Enregistrez une fois, gardez pour des générations. Lancez un enregistrement, ajoutez un titre et “quand c’est arrivé”, puis partagez en toute sécurité.',
      landingStartCardTitle: 'Commencer un enregistrement',
      landingStartCardText: 'Un seul geste pour démarrer. Ajoutez le titre et “quand c’est arrivé” plus tard. Transcription Whisper claire dans votre langue.',
      landingStartBtn: 'Enregistrer',
      landingStoriesCardTitle: 'Voir mes histoires',
      landingStoriesCardText: 'Parcourez votre bibliothèque privée, joignez des photos, réécrivez avec l’IA et exportez.',
      landingStoriesBtn: 'Mes histoires',
      featTitle1: 'Texte prêt pour un livre',
      featText1: 'Transcription précise + réécriture IA pour un récit chaleureux et lisible.',
      featTitle2: 'Partage privé et simple',
      featText2: 'Espace familial privé, accès en lecture seule pour vos proches.',
      featTitle3: 'Photos & dates',
      featText3: 'Ajoutez des photos et des dates pour classer les histoires chronologiquement.',
      priceTitle: 'Offres',
      priceFreeTitle: 'Gratuit',
      priceFreeBody: 'Enregistrement basique, bibliothèque locale, quelques minutes par histoire.',
      priceStorytellerTitle: 'Conteur',
      priceStorytellerBody: '6,99 €/mois • Transcription Whisper + réécriture IA, outils d’export.',
      priceFamilyTitle: 'Famille',
      priceFamilyBody: '8,99 €/mois • Partage avec 4 proches (lecture/écoute).',
      priceExclusiveTitle: 'Exclusive',
      priceExclusiveBody: '11,99 €/mois • Jusqu’à 5 h de transcription par mois.',
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
      settingsPlansDetail: 'Offres & Tarifs',
    },

    nl: {
      navHome: 'Home', navLogin: 'Inloggen', navRecord: 'Opnemen', navStories: 'Mijn verhalen', navSettings: 'Instellingen',
      footerAbout: 'Memoir helpt je op een zachte manier levensverhalen vast te leggen en veilig te bewaren voor je familie.',
      footerLegal: 'Juridisch & beleid',
      heroKicker: 'Memoir App',
      heroTitleA: 'Bewaar je', heroTitleB: 'herinneringen voor altijd',
      heroBlurb: 'Neem één keer op, bewaar voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.',
      landingStartCardTitle: 'Start opname',
      landingStartCardText: 'Met één tik beginnen. Titel en datum later toevoegen. Whisper-transcriptie in jouw taal.',
      landingStartBtn: 'Opnemen',
      landingStoriesCardTitle: 'Bekijk mijn verhalen',
      landingStoriesCardText: 'Blader door je privébibliotheek, voeg foto’s toe, herschrijf met AI en exporteer.',
      landingStoriesBtn: 'Mijn verhalen',
      featTitle1: 'Boekwaardig',
      featText1: 'Nauwkeurige transcriptie + AI-herschrijven voor warm, leesbaar proza.',
      featTitle2: 'Privé delen',
      featText2: 'Deel eenvoudig in je familiekring, alleen-lezen voor genodigden.',
      featTitle3: 'Foto’s & data',
      featText3: 'Voeg foto’s en “wanneer het gebeurde” toe voor chronologische ordening.',
      priceTitle: 'Pakketten',
      priceFreeTitle: 'Gratis',
      priceFreeBody: 'Basisopname, lokale bibliotheek, enkele minuten per verhaal.',
      priceStorytellerTitle: 'Verteller',
      priceStorytellerBody: '€6,99/mnd • Whisper + AI-herschrijven, exporttools.',
      priceFamilyTitle: 'Familie',
      priceFamilyBody: '€8,99/mnd • Deel met 4 familieleden (lezen/luisteren).',
      priceExclusiveTitle: 'Exclusief',
      priceExclusiveBody: '€11,99/mnd • Tot 5 uur transcriptie per maand.',
      priceChoose: 'Kies',
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
      storiesEmpty: 'Je verhalen worden hier privé bewaard.',
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
      footerAbout: 'Memoir es una forma suave de capturar historias de vida y mantenerlas seguras para tu familia.',
      footerLegal: 'Avisos legales',
      heroKicker: 'Aplicación Memoir',
      heroTitleA: 'Conserva tus', heroTitleB: 'recuerdos para siempre',
      heroBlurb: 'Graba una vez y guarda para generaciones. Comienza con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura.',
      landingStartCardTitle: 'Comenzar a grabar',
      landingStartCardText: 'Un toque para empezar. Añade título y fecha después. Transcripción Whisper clara en tu idioma.',
      landingStartBtn: 'Grabar',
      landingStoriesCardTitle: 'Ver mis historias',
      landingStoriesCardText: 'Biblioteca privada, fotos, reescritura con IA y exportación.',
      landingStoriesBtn: 'Mis historias',
      featTitle1: 'Texto listo para libro',
      featText1: 'Transcripción precisa + reescritura IA para un relato cálido y legible.',
      featTitle2: 'Compartir privado',
      featText2: 'Espacio familiar privado con acceso de solo lectura para tus seres queridos.',
      featTitle3: 'Fotos y fechas',
      featText3: 'Añade fotos y “cuándo ocurrió” para ordenar cronológicamente.',
      priceTitle: 'Planes',
      priceFreeTitle: 'Gratis',
      priceFreeBody: 'Grabación básica, biblioteca local, pocos minutos por historia.',
      priceStorytellerTitle: 'Narrador',
      priceStorytellerBody: '6,99 €/mes • Whisper + reescritura IA y exportación.',
      priceFamilyTitle: 'Familiar',
      priceFamilyBody: '8,99 €/mes • Comparte con hasta 4 familiares (leer/escuchar).',
      priceExclusiveTitle: 'Exclusivo',
      priceExclusiveBody: '11,99 €/mes • Hasta 5 horas de transcripción al mes.',
      priceChoose: 'Elegir plan',
      recordTitle: 'Grabar',
      recordSuggested: 'Sugerencias de hoy',
      recordSuggestOther: 'Sugerir otras',
      recordNotes: 'Notas (opcional)',
      recordSave: 'Guardar historia',
      recordWhen: '¿Cuándo ocurrió?',
      recordWhenPH: 'p.ej., “verano de 1945”, “principios de 2018”, “15 feb 1972”',
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

  // ------- helpers -------
  const getLang = () => localStorage.getItem(STORE_KEY) || DEFAULT_LANG;
  const setLang = (code) => {
    const safe = strings[code] ? code : DEFAULT_LANG;
    localStorage.setItem(STORE_KEY, safe);
    applyTranslations(safe);
    // dispatch so pages can react
    window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code: safe }}));
  };

  function t(key, code) {
    const lang = code || getLang();
    const pack = strings[lang] || strings[DEFAULT_LANG];
    // fallback chain: lang -> en -> key
    return (pack && pack[key]) || (strings.en && strings.en[key]) || null;
  }

  function applyTranslations(code) {
    const lang = code || getLang();

    // data-i18n="key" -> textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key, lang);
      if (val != null) el.textContent = val; // don't blank if missing
    });

    // data-i18n-attr="placeholder:key;title:key2"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr') || '';
      spec.split(';').forEach(entry => {
        const [attr, k] = entry.split(':').map(s => (s||'').trim());
        if (!attr || !k) return;
        const val = t(k, lang);
        if (val != null) el.setAttribute(attr, val);
      });
    });
  }

  // expose
  window.MEMOIR_I18N = {
    strings,
    getLang,
    setLang,
    t,
    apply: applyTranslations
  };

  // init at DOMContentLoaded so existing HTML is present
  document.addEventListener('DOMContentLoaded', () => {
    applyTranslations(getLang());
  });
})();
</script>
