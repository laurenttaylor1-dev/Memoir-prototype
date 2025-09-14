/* Global i18n helper for Memoir
 * - Persists selected language to localStorage ("memoir.lang")
 * - Translates any element that has:
 *     data-i18n="key"                  -> sets textContent
 *     data-i18n-attr="placeholder:key" -> sets placeholder
 *     data-i18n-attr="title:key"       -> sets title
 * - Emits `memoir:lang` CustomEvent({detail:{code}})
 * - Safe to call repeatedly. Works with header/footer loaders.
 */

(function(){
  const STORE_KEY = 'memoir.lang';
  const DEFAULT_LANG = 'en';

  const strings = {
    en: {
      // Header
      navHome: 'Home',
      navLogin: 'Login',
      navRecord: 'Record',
      navStories: 'My Stories',

      // Footer
      footerAbout: 'Memoir is a gentle way to capture life stories and keep them safe for your family.',
      footerLegal: 'Legal & Policies',

      // Landing (hero + action cards)
      heroTitleA: 'Preserve Your',
      heroTitleB: 'Memories Forever',
      heroBlurb: 'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      landingStartCardTitle: 'Start Recording',
      landingStartCardText: 'One tap to begin. Add a title and “when it happened” later. Whisper AI transcribes clearly in your language.',
      landingStartBtn: 'Start Recording',
      landingStoriesCardTitle: 'View My Stories',
      landingStoriesCardText: 'Browse your private library, attach photos, AI-rewrite for clarity, and export.',
      landingStoriesBtn: 'My Stories',

      // Features row
      feat1Title: 'Clear transcription (Whisper)',
      feat1Text: 'Accurate, multilingual speech-to-text built for real voices and accents.',
      feat2Title: 'AI rewrite to book-quality',
      feat2Text: 'Turn raw speech into warm, readable prose—perfect for your family archive.',
      feat3Title: 'Private sharing',
      feat3Text: 'Your stories stay yours. Share read-only access with family you choose.',

      // Pricing on landing/settings
      planFree: 'Free',
      planPremium: 'Storyteller',
      planFamily: 'Family',
      planExclusive: 'Exclusive',
      priceFree: '€0 / month',
      pricePremium: '€6.99 / month',
      priceFamily: '€8.99 / month',
      priceExclusive: '€11.99 / month',
      planFreeDesc: 'Record locally, keep a private library on your device.',
      planPremiumDesc: 'Cloud sync + Whisper transcription + AI rewrite. For solo authors.',
      planFamilyDesc: 'Everything in Storyteller, plus read-only sharing for up to 4 family members.',
      planExclusiveDesc: 'Up to 5 hours of transcription monthly, priority processing, and premium support.',
      planCTA: 'Choose plan',

      // Record page
      recordTitle: 'Record',
      recordFree: 'FREE',
      recordGuided: 'GUIDED',
      recordPromptsToday: "Today's suggested prompts",
      recordOtherPrompts: 'Suggest other prompts',
      recordNotes: 'Notes (optional)',
      recordTitleLabel: 'Title',
      recordWhenLabel: 'When did this happen?',
      recordWhenPH: 'e.g. “summer 1945”, “early 2018”, “15 Feb 1972”',
      recordAddPhoto: 'Add photo (optional)',
      recordTranscript: 'Transcript',
      recordSave: 'Save story',
      recordMicHintRecording: 'Recording… transcription will appear live when online.',
      recordMicHintOffline: 'Offline or server unavailable — audio will be saved and sent later.',

      // Stories page
      storiesTitle: 'My Stories',
      storiesEmpty: 'Your stories will all be added to this private library.',
      storiesCount: 'stories',
      storiesRewrite: 'Rewrite (AI)',
      storiesExport: 'Export',
      storiesDelete: 'Delete',

      // Settings page
      settingsTitle: 'Settings',
      settingsAccount: 'Account',
      settingsLanguage: 'Language',
      settingsPrivacy: 'Privacy',
      settingsFAQ: 'FAQ',
      settingsPlans: 'Subscription details',
      settingsSignedInAs: 'Signed in as',
      settingsPlan: 'Current plan',
      settingsChangePlan: 'Change plan',
      settingsFAQIntro: 'Quick answers to common questions.',
      settingsPrivacyIntro: 'Your data and choices.',
      settingsLanguageIntro: 'Choose the language used across the app.',
      settingsPlansIntro: 'Compare plans and pick the one that fits your needs.',
      settingsPlanLines: {
        free: 'Free — record locally (no cloud sync).',
        storyteller: 'Storyteller — cloud sync + Whisper + AI rewrite.',
        family: 'Family — Storyteller features + share with up to 4 family members (read-only).',
        exclusive: 'Exclusive — up to 5 hours/mo transcription, priority, premium support.'
      },
      settingsChoose: 'Choose',
    },

    fr: {
      navHome: 'Accueil',
      navLogin: 'Connexion',
      navRecord: 'Enregistrer',
      navStories: 'Mes histoires',
      footerAbout: 'Memoir est un moyen doux de capturer les histoires de vie et de les conserver pour votre famille.',
      footerLegal: 'Mentions légales',

      heroTitleA: 'Préservez vos',
      heroTitleB: 'souvenirs pour toujours',
      heroBlurb: 'Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et “quand cela s’est passé”, puis partagez en toute sécurité.',
      landingStartCardTitle: 'Commencer un enregistrement',
      landingStartCardText: 'Un geste pour démarrer. Ajoutez le titre et “quand cela s’est passé” plus tard. Whisper transcrit clairement dans votre langue.',
      landingStartBtn: 'Commencer',
      landingStoriesCardTitle: 'Voir mes histoires',
      landingStoriesCardText: 'Parcourez votre bibliothèque privée, ajoutez des photos, réécrivez avec l’IA et exportez.',
      landingStoriesBtn: 'Mes histoires',

      feat1Title: 'Transcription claire (Whisper)',
      feat1Text: 'Reconnaissance de la parole précise et multilingue.',
      feat2Title: 'Réécriture IA de qualité “livre”',
      feat2Text: 'Transformez la parole brute en prose chaleureuse et lisible.',
      feat3Title: 'Partage privé',
      feat3Text: 'Vos histoires restent à vous. Partage en lecture seule avec vos proches.',

      planFree: 'Gratuit',
      planPremium: 'Conteur',
      planFamily: 'Famille',
      planExclusive: 'Exclusif',
      priceFree: '0 € / mois',
      pricePremium: '6,99 € / mois',
      priceFamily: '8,99 € / mois',
      priceExclusive: '11,99 € / mois',
      planFreeDesc: 'Enregistrez en local, conservez une bibliothèque privée sur votre appareil.',
      planPremiumDesc: 'Synchronisation cloud + Whisper + réécriture IA. Pour les auteurs solo.',
      planFamilyDesc: 'Tout Conteur + partage en lecture seule pour 4 proches.',
      planExclusiveDesc: 'Jusqu’à 5 h/mois, priorité et support premium.',
      planCTA: 'Choisir ce plan',

      recordTitle: 'Enregistrer',
      recordFree: 'LIBRE',
      recordGuided: 'GUIDÉ',
      recordPromptsToday: 'Suggestions du jour',
      recordOtherPrompts: 'Autres suggestions',
      recordNotes: 'Notes (facultatif)',
      recordTitleLabel: 'Titre',
      recordWhenLabel: 'Quand cela s’est-il produit ?',
      recordWhenPH: 'ex. “été 1945”, “début 2018”, “15 fév. 1972”',
      recordAddPhoto: 'Ajouter une photo (facultatif)',
      recordTranscript: 'Transcription',
      recordSave: 'Enregistrer l’histoire',
      recordMicHintRecording: 'Enregistrement… la transcription s’affichera en ligne.',
      recordMicHintOffline: 'Hors-ligne — l’audio sera envoyé plus tard.',

      storiesTitle: 'Mes histoires',
      storiesEmpty: 'Vos histoires seront ajoutées à cette bibliothèque privée.',
      storiesCount: 'histoires',
      storiesRewrite: 'Réécrire (IA)',
      storiesExport: 'Exporter',
      storiesDelete: 'Supprimer',

      settingsTitle: 'Paramètres',
      settingsAccount: 'Compte',
      settingsLanguage: 'Langue',
      settingsPrivacy: 'Confidentialité',
      settingsFAQ: 'FAQ',
      settingsPlans: 'Détails des abonnements',
      settingsSignedInAs: 'Connecté en tant que',
      settingsPlan: 'Abonnement actuel',
      settingsChangePlan: 'Changer d’abonnement',
      settingsFAQIntro: 'Réponses rapides aux questions fréquentes.',
      settingsPrivacyIntro: 'Vos données et vos choix.',
      settingsLanguageIntro: 'Choisissez la langue de l’application.',
      settingsPlansIntro: 'Comparez les offres et choisissez celle qui vous convient.',
      settingsPlanLines: {
        free: 'Gratuit — enregistrement local.',
        storyteller: 'Conteur — cloud + Whisper + réécriture IA.',
        family: 'Famille — Conteur + partage en lecture seule (4 proches).',
        exclusive: 'Exclusif — 5 h/mois, priorité, support premium.'
      },
      settingsChoose: 'Choisir',
    },

    nl: {
      navHome: 'Home',
      navLogin: 'Inloggen',
      navRecord: 'Opnemen',
      navStories: 'Mijn verhalen',
      footerAbout: 'Memoir is een zachte manier om levensverhalen vast te leggen en veilig te bewaren voor je familie.',
      footerLegal: 'Juridisch & beleid',

      heroTitleA: 'Bewaar je',
      heroTitleB: 'herinneringen voor altijd',
      heroBlurb: 'Neem één keer op en bewaar het voor generaties. Start met één tik, voeg later een titel en “wanneer het gebeurde” toe en deel veilig met je familie.',
      landingStartCardTitle: 'Opname starten',
      landingStartCardText: 'Start met één tik. Titel en “wanneer” kan later. Whisper zet helder om naar tekst.',
      landingStartBtn: 'Opnemen',
      landingStoriesCardTitle: 'Mijn verhalen bekijken',
      landingStoriesCardText: 'Blader door je privébibliotheek, voeg foto’s toe, herschrijf met AI en exporteer.',
      landingStoriesBtn: 'Mijn verhalen',

      feat1Title: 'Heldere transcriptie (Whisper)',
      feat1Text: 'Nauwkeurige, meertalige spraak-naar-tekst.',
      feat2Title: 'AI-herschrijven naar boekkwaliteit',
      feat2Text: 'Maak van ruwe spraak warme, leesbare teksten.',
      feat3Title: 'Privé delen',
      feat3Text: 'Jij bepaalt wie mag meelezen, alleen-lezen toegang.',

      planFree: 'Gratis',
      planPremium: 'Verteller',
      planFamily: 'Familie',
      planExclusive: 'Exclusief',
      priceFree: '€0 / maand',
      pricePremium: '€6,99 / maand',
      priceFamily: '€8,99 / maand',
      priceExclusive: '€11,99 / maand',
      planFreeDesc: 'Lokaal opnemen, privébibliotheek op je toestel.',
      planPremiumDesc: 'Cloudsync + Whisper + AI-herschrijven. Voor solo-auteurs.',
      planFamilyDesc: 'Alles van Verteller + delen met 4 familieleden (alleen lezen).',
      planExclusiveDesc: 'Tot 5 uur transcriptie per maand, prioriteit en premium support.',
      planCTA: 'Kies plan',

      recordTitle: 'Opnemen',
      recordFree: 'VRIJ',
      recordGuided: 'GELEID',
      recordPromptsToday: 'Suggesties van vandaag',
      recordOtherPrompts: 'Andere suggesties',
      recordNotes: 'Notities (optioneel)',
      recordTitleLabel: 'Titel',
      recordWhenLabel: 'Wanneer gebeurde dit?',
      recordWhenPH: 'bijv. “zomer 1945”, “begin 2018”, “15 feb 1972”',
      recordAddPhoto: 'Foto toevoegen (optioneel)',
      recordTranscript: 'Transcriptie',
      recordSave: 'Verhaal opslaan',
      recordMicHintRecording: 'Opnemen… transcriptie verschijnt live als je online bent.',
      recordMicHintOffline: 'Offline — audio wordt later verzonden.',

      storiesTitle: 'Mijn verhalen',
      storiesEmpty: 'Je verhalen komen hier in je privébibliotheek.',
      storiesCount: 'verhalen',
      storiesRewrite: 'Herschrijf (AI)',
      storiesExport: 'Exporteren',
      storiesDelete: 'Verwijderen',

      settingsTitle: 'Instellingen',
      settingsAccount: 'Account',
      settingsLanguage: 'Taal',
      settingsPrivacy: 'Privacy',
      settingsFAQ: 'FAQ',
      settingsPlans: 'Abonnementsdetails',
      settingsSignedInAs: 'Ingelogd als',
      settingsPlan: 'Huidig abonnement',
      settingsChangePlan: 'Abonnement wijzigen',
      settingsFAQIntro: 'Snel antwoord op veelgestelde vragen.',
      settingsPrivacyIntro: 'Jouw data en keuzes.',
      settingsLanguageIntro: 'Kies de taal van de app.',
      settingsPlansIntro: 'Vergelijk en kies wat past.',
      settingsPlanLines: {
        free: 'Gratis — lokaal opnemen.',
        storyteller: 'Verteller — cloud + Whisper + AI-herschrijven.',
        family: 'Familie — Verteller + delen met 4 familieleden.',
        exclusive: 'Exclusief — 5 u/maand, prioriteit, premium support.'
      },
      settingsChoose: 'Kiezen',
    },

    es: {
      navHome: 'Inicio',
      navLogin: 'Acceder',
      navRecord: 'Grabar',
      navStories: 'Mis historias',
      footerAbout: 'Memoir es una forma amable de capturar historias de vida y guardarlas para tu familia.',
      footerLegal: 'Avisos legales',

      heroTitleA: 'Conserva para siempre',
      heroTitleB: 'tus recuerdos',
      heroBlurb: 'Graba una vez y guárdalo para generaciones. Empieza con un toque, añade un título y “cuándo pasó” y comparte de forma segura.',
      landingStartCardTitle: 'Empezar a grabar',
      landingStartCardText: 'Un toque para comenzar. Añade el título y “cuándo” después. Whisper transcribe con claridad.',
      landingStartBtn: 'Grabar',
      landingStoriesCardTitle: 'Ver mis historias',
      landingStoriesCardText: 'Explora tu biblioteca privada, añade fotos, reescribe con IA y exporta.',
      landingStoriesBtn: 'Mis historias',

      feat1Title: 'Transcripción clara (Whisper)',
      feat1Text: 'Reconocimiento de voz preciso y multilingüe.',
      feat2Title: 'Reescritura IA con calidad de libro',
      feat2Text: 'Convierte la voz en prosa cálida y legible.',
      feat3Title: 'Compartir privado',
      feat3Text: 'Control total: acceso de solo lectura a tu familia.',

      planFree: 'Gratis',
      planPremium: 'Narrador',
      planFamily: 'Familiar',
      planExclusive: 'Exclusivo',
      priceFree: '€0 / mes',
      pricePremium: '€6,99 / mes',
      priceFamily: '€8,99 / mes',
      priceExclusive: '€11,99 / mes',
      planFreeDesc: 'Graba localmente y guarda una biblioteca privada en tu dispositivo.',
      planPremiumDesc: 'Sincronización en la nube + Whisper + reescritura IA. Para autores individuales.',
      planFamilyDesc: 'Todo en Narrador + compartir con hasta 4 familiares (solo lectura).',
      planExclusiveDesc: 'Hasta 5 horas/mes, prioridad y soporte premium.',
      planCTA: 'Elegir plan',

      recordTitle: 'Grabar',
      recordFree: 'LIBRE',
      recordGuided: 'GUIADO',
      recordPromptsToday: 'Sugerencias de hoy',
      recordOtherPrompts: 'Otras sugerencias',
      recordNotes: 'Notas (opcional)',
      recordTitleLabel: 'Título',
      recordWhenLabel: '¿Cuándo ocurrió?',
      recordWhenPH: 'p. ej., “verano de 1945”, “inicios de 2018”, “15 feb 1972”',
      recordAddPhoto: 'Añadir foto (opcional)',
      recordTranscript: 'Transcripción',
      recordSave: 'Guardar historia',
      recordMicHintRecording: 'Grabando… la transcripción aparecerá cuando haya conexión.',
      recordMicHintOffline: 'Sin conexión — el audio se enviará más tarde.',

      storiesTitle: 'Mis historias',
      storiesEmpty: 'Tus historias se añadirán aquí a tu biblioteca privada.',
      storiesCount: 'historias',
      storiesRewrite: 'Reescribir (IA)',
      storiesExport: 'Exportar',
      storiesDelete: 'Eliminar',

      settingsTitle: 'Ajustes',
      settingsAccount: 'Cuenta',
      settingsLanguage: 'Idioma',
      settingsPrivacy: 'Privacidad',
      settingsFAQ: 'FAQ',
      settingsPlans: 'Detalles de suscripción',
      settingsSignedInAs: 'Conectado como',
      settingsPlan: 'Plan actual',
      settingsChangePlan: 'Cambiar plan',
      settingsFAQIntro: 'Respuestas rápidas a preguntas frecuentes.',
      settingsPrivacyIntro: 'Tus datos y elecciones.',
      settingsLanguageIntro: 'Elige el idioma de la app.',
      settingsPlansIntro: 'Compara planes y elige el tuyo.',
      settingsPlanLines: {
        free: 'Gratis — grabación local.',
        storyteller: 'Narrador — nube + Whisper + reescritura IA.',
        family: 'Familiar — Narrador + compartir con 4 familiares.',
        exclusive: 'Exclusivo — 5 h/mes, prioridad, soporte premium.'
      },
      settingsChoose: 'Elegir',
    }
  };

  const flags  = { en:'🇬🇧', fr:'🇫🇷', nl:'🇧🇪', es:'🇪🇸' };
  const labels = { en:'English', fr:'Français', nl:'Nederlands', es:'Español' };

  function getLang(){
    const fromStore = localStorage.getItem(STORE_KEY);
    return (fromStore && strings[fromStore]) ? fromStore : DEFAULT_LANG;
  }
  function setLang(code){
    const lang = strings[code] ? code : DEFAULT_LANG;
    localStorage.setItem(STORE_KEY, lang);
    applyAll(document);
    window.dispatchEvent(new CustomEvent('memoir:lang',{ detail:{ code: lang }}));
  }

  function t(key){
    const lang = getLang();
    return (strings[lang] && strings[lang][key]) || strings[DEFAULT_LANG][key] || key;
  }

  // Apply translations to a root (document or a subtree)
  function applyAll(root){
    const lang = getLang();

    // 1) elements with data-i18n="key"
    root.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const found =
        (strings[lang] && strings[lang][key]) ??
        (strings.en   && strings.en[key]);

    // Only set text if we actually have a translation.
    if (typeof found === 'string' && found.trim() !== '') {
      el.textContent = found;
    }

   // 2) elements with data-i18n-attr="placeholder:key;title:key2"
   root.querySelectorAll('[data-i18n-attr]').forEach(el=>{
     const map = el.getAttribute('data-i18n-attr');
     if (!map) return;
     map.split(';').forEach(pair=>{
       const [attr, key] = pair.split(':').map(s=>s && s.trim());
       if (!attr || !key) return;
       const found =
         (strings[lang] && strings[lang][key]) ??
         (strings.en   && strings.en[key]);
       if (typeof found === 'string' && found.trim() !== '') {
         el.setAttribute(attr, found);
       }
     });
   });

   // Update current language flag/label if present
   const flagEl = document.querySelector('#lang-current-flag');
   const labEl  = document.querySelector('#lang-current-label');
   if (flagEl) flagEl.textContent = (flags[lang] || '🌐');
   if (labEl)  labEl.textContent  = (labels[lang] || lang.toUpperCase());
  }  

  // Initial apply as soon as DOM is ready
  function init(){
    applyAll(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also react when header/footer get injected later
  window.addEventListener('memoir:header-ready', ()=>applyAll(document));
  window.addEventListener('memoir:footer-ready', ()=>applyAll(document));
  window.addEventListener('memoir:lang', (e)=>applyAll(document));

  // Expose API
  window.MEMOIR_I18N = { strings, flags, labels, getLang, setLang, t, applyAll };
})();
