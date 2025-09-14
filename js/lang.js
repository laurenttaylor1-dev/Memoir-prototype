/* Global i18n helper for Memoir
 * - Persists selected language to localStorage ("memoir.lang")
 * - Translates any element that has:
 *     data-i18n="key"                  -> sets textContent
 *     data-i18n-attr="placeholder:key" -> sets placeholder (or title:..., aria-label:...)
 * - Emits `memoir:lang` CustomEvent({detail:{code}})
 * - Safe to call repeatedly. Works with header/footer loaders.
 */
(function(){
  const STORE_KEY = 'memoir.lang';
  const DEFAULT_LANG = 'en';

  const strings = {
    en: {
      // Header
      navHome:'Home', navLogin:'Login', navRecord:'Record', navStories:'My Stories', navSettings:'Settings',
      brandKicker:'MEMOIR APP',

      // Footer
      footerAbout:'Memoir helps families capture life stories with beautiful voice capture, polished AI rewrites and a family library for all generations.',
      footerLegal:'Legal & Policies',

      // Landing (hero + action cards)
      heroTitleA:'Preserve Your', heroTitleB:'Memories Forever',
      heroBlurb:'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      landingStartCardTitle:'Start Recording',
      landingStartCardText:'One tap to begin. Add a title and “when it happened” later. Whisper AI transcribes clearly in your language.',
      startRecording:'Start Recording',
      landingStoriesCardTitle:'My Stories',
      landingStoriesCardText:'Browse your private library, attach photos, AI-rewrite for clarity, and export.',
      viewStories:'My Stories',

      // Features
      featuresTitle:'Why Memoir',
      featuresIntro:'Three reasons families choose Memoir.',
      feat1Title:'Accurate transcription (Whisper)',
      feat1Text:'Capture every word with Whisper-powered transcription for high accuracy and clarity.',
      feat2Title:'AI rewrite for families',
      feat2Text:'Turn your spoken words into polished, engaging stories — like real literature your family will love to read.',
      feat3Title:'Private or shared',
      feat3Text:'Keep stories private or share read-only with selected family members; everything syncs across your devices.',

      // Pricing
      pricingTitle:'Pricing',
      ctaTryFree:'Try free', ctaSubscribe:'Subscribe',
      planFreeTitle:'Free', planFreePrice:'€0',
      planFreeB1:'Up to 10 stories', planFreeB2:'Max 2 minutes transcription per story', planFreeB3:'Private library on all your devices',
      planStoryTitle:'Storyteller — €6.99/month', planStoryPrice:'€6.99 / mo',
      planStoryB1:'Up to 2.5 hours / month of AI transcription', planStoryB2:'AI Rewrite (polish stories), export to PDF/CSV', planStoryB3:'Priority processing',
      planFamilyTitle:'Family — €8.99/month', planFamilyPrice:'€8.99 / mo',
      planFamilyB1:'Everything in Storyteller', planFamilyB2:'Share your library with up to 4 read-only family members', planFamilyB3:'Invite by email; revoke anytime',
      planExclTitle:'Exclusive — €11.99/month', planExclPrice:'€11.99 / mo',
      planExclB1:'Up to 5 hours / month of AI transcription + rewrite', planExclB2:'Family sharing (up to 4)', planExclB3:'Best for active storytellers',

      // Record page
      recordTitle:'Record',
      recordBtn:'Record',
      tabFree:'Free', tabGuided:'Guided',
      promptsLabel:"Today's suggested prompts", promptsRefresh:'Suggest other prompts',
      notesLabel:'Notes (optional)', notesPlaceholder:'Add a quick note…',
      titleLabel:'Title', titlePlaceholder:'Story title',
      whenLabel:'When did this happen?', whenPlaceholder:'e.g. "summer 1945", "early 2018", "15 Feb 1972"',
      photoLabel:'Add photo (optional)',
      transcriptLabel:'Transcript', transcriptEmpty:'Your words will appear here…',
      saveStory:'Save story',

      // Stories page
      storiesTitle:'My Stories',
      statStories:'Stories', statFamily:'Family Members',
      libraryBlurb:'Your stories will appear in your private library here.',
      storiesEmpty:'No stories yet. Record your first one!',
      storiesRewrite:'Rewrite with AI', storiesExport:'Export', storiesDelete:'Delete',

      // Settings
      settingsTitle:'Settings',
      settingsAccount:'Account', settingsAccountCopy:'Manage your sign-in and personal details.', settingsSignIn:'Sign in',
      settingsSub:'Subscription', settingsSubCopy:'Choose or change your plan.',
      settingsBilling:'Billing', settingsBillingCopy:'View invoices and next renewal.', settingsManageBilling:'Manage billing',
      settingsFaq:'FAQ',
      faqQ1:'Is there a free plan?', faqQ2:'Which languages are supported?', faqQ3:'How is transcription done?',
      settingsPlanDetails:'Subscription details'
    },

    fr: {
      navHome:'Accueil', navLogin:'Connexion', navRecord:'Enregistrer', navStories:'Mes histoires', navSettings:'Réglages',
      brandKicker:'MEMOIR APP',
      footerAbout:'Memoir aide les familles à capturer leurs histoires avec une belle prise de voix, des réécritures IA soignées et une bibliothèque familiale.',
      footerLegal:'Mentions légales',
      heroTitleA:'Préservez vos', heroTitleB:'souvenirs pour toujours',
      heroBlurb:'Enregistrez une fois, gardez pour des générations. Un seul geste, ajoutez un titre et “quand c’est arrivé”, puis partagez en toute sécurité.',
      landingStartCardTitle:'Commencer un enregistrement',
      landingStartCardText:'Un geste pour commencer. Ajoutez le titre et “quand” plus tard. Whisper transcrit clairement dans votre langue.',
      startRecording:"Commencer l'enregistrement",
      landingStoriesCardTitle:'Mes histoires',
      landingStoriesCardText:'Parcourez votre bibliothèque privée, ajoutez des photos, réécrivez avec l’IA et exportez.',
      viewStories:'Mes histoires',
      featuresTitle:'Pourquoi Memoir',
      featuresIntro:'Trois raisons de choisir Memoir.',
      feat1Title:'Transcription précise (Whisper)',
      feat1Text:'Une reconnaissance vocale précise et multilingue pour les vraies voix.',
      feat2Title:'Réécriture IA pour la famille',
      feat2Text:'Transformez la parole en histoires chaleureuses et lisibles — comme un vrai livre.',
      feat3Title:'Privé ou partagé',
      feat3Text:'Restez privé ou partagez en lecture seule avec la famille; tout est synchronisé.',
      pricingTitle:'Tarifs',
      ctaTryFree:'Essayer', ctaSubscribe:'S’abonner',
      planFreeTitle:'Gratuit', planFreePrice:'0 €',
      planFreeB1:'Jusqu’à 10 histoires', planFreeB2:'2 minutes de transcription par histoire', planFreeB3:'Bibliothèque privée sur tous vos appareils',
      planStoryTitle:'Storyteller — 6,99 €/mois', planStoryPrice:'6,99 € / mois',
      planStoryB1:'Jusqu’à 2,5 h / mois de transcription IA', planStoryB2:'Réécriture IA, export PDF/CSV', planStoryB3:'Traitement prioritaire',
      planFamilyTitle:'Famille — 8,99 €/mois', planFamilyPrice:'8,99 € / mois',
      planFamilyB1:'Tout dans Storyteller', planFamilyB2:'Partage avec 4 proches en lecture seule', planFamilyB3:'Invitation par email; révocation possible',
      planExclTitle:'Exclusive — 11,99 €/mois', planExclPrice:'11,99 € / mois',
      planExclB1:'Jusqu’à 5 h / mois de transcription + réécriture', planExclB2:'Partage familial (jusqu’à 4)', planExclB3:'Idéal pour conteurs actifs',
      recordTitle:'Enregistrer', recordBtn:'Enregistrer', tabFree:'Libre', tabGuided:'Guidé',
      promptsLabel:'Suggestions du jour', promptsRefresh:'Autres suggestions',
      notesLabel:'Notes (optionnel)', notesPlaceholder:'Ajoutez une note…',
      titleLabel:'Titre', titlePlaceholder:'Titre de l’histoire',
      whenLabel:'Quand est-ce arrivé ?', whenPlaceholder:'ex. "été 1945", "début 2018", "15 fév 1972"',
      photoLabel:'Ajouter une photo (optionnel)',
      transcriptLabel:'Transcription', transcriptEmpty:'Vos mots apparaîtront ici…',
      saveStory:'Enregistrer l’histoire',
      storiesTitle:'Mes histoires',
      statStories:'Histoires', statFamily:'Membres de la famille',
      libraryBlurb:'Vos histoires apparaîtront ici dans votre bibliothèque privée.',
      storiesEmpty:'Pas encore d’histoire. Enregistrez votre première !',
      storiesRewrite:'Réécrire avec IA', storiesExport:'Exporter', storiesDelete:'Supprimer',
      settingsTitle:'Réglages',
      settingsAccount:'Compte', settingsAccountCopy:'Gérez votre connexion et vos informations.', settingsSignIn:'Se connecter',
      settingsSub:'Abonnement', settingsSubCopy:'Choisissez ou changez votre offre.',
      settingsBilling:'Facturation', settingsBillingCopy:'Voir les factures et le prochain renouvellement.', settingsManageBilling:'Gérer la facturation',
      settingsFaq:'FAQ',
      faqQ1:'Y a-t-il une offre gratuite ?', faqQ2:'Quelles langues sont prises en charge ?', faqQ3:'Comment se fait la transcription ?',
      settingsPlanDetails:'Détails des abonnements'
    },

    nl: {
      navHome:'Home', navLogin:'Inloggen', navRecord:'Opnemen', navStories:'Mijn verhalen', navSettings:'Instellingen',
      brandKicker:'MEMOIR APP',
      footerAbout:'Memoir helpt families levensverhalen vastleggen met mooie stemopnames, AI-herschrijvingen en een familiebibliotheek.',
      footerLegal:'Juridisch & beleid',
      heroTitleA:'Bewaar je', heroTitleB:'herinneringen voor altijd',
      heroBlurb:'Neem één keer op voor generaties. Eén tik, voeg een titel en “wanneer” toe en deel veilig met je familie.',
      landingStartCardTitle:'Opname starten',
      landingStartCardText:'Met één tik beginnen. Titel en “wanneer” later. Whisper transcribeert duidelijk in je taal.',
      startRecording:'Opname starten',
      landingStoriesCardTitle:'Mijn verhalen',
      landingStoriesCardText:'Blader door je privébibliotheek, voeg foto’s toe, herschrijf met AI en exporteer.',
      viewStories:'Mijn verhalen',
      featuresTitle:'Waarom Memoir',
      featuresIntro:'Drie redenen om te kiezen voor Memoir.',
      feat1Title:'Nauwkeurige transcriptie (Whisper)',
      feat1Text:'Zeer nauwkeurige spraak-naar-tekst voor echte stemmen.',
      feat2Title:'AI-herschrijven voor families',
      feat2Text:'Maak van gesproken woorden leesbare, warme verhalen — als literatuur.',
      feat3Title:'Privé of gedeeld',
      feat3Text:'Houd privé of deel alleen-lezen met familie; gesynchroniseerd op je apparaten.',
      pricingTitle:'Prijzen',
      ctaTryFree:'Probeer gratis', ctaSubscribe:'Abonneren',
      planFreeTitle:'Gratis', planFreePrice:'€0',
      planFreeB1:'Tot 10 verhalen', planFreeB2:'Max 2 minuten per verhaal', planFreeB3:'Privébibliotheek op al je apparaten',
      planStoryTitle:'Storyteller — €6,99/maand', planStoryPrice:'€6,99 / mnd',
      planStoryB1:'Tot 2,5 uur / maand AI-transcriptie', planStoryB2:'AI-herschrijven, export naar PDF/CSV', planStoryB3:'Prioriteit',
      planFamilyTitle:'Familie — €8,99/maand', planFamilyPrice:'€8,99 / mnd',
      planFamilyB1:'Alles van Storyteller', planFamilyB2:'Deel met 4 familieleden (alleen lezen)', planFamilyB3:'Uitnodigen per e-mail, intrekken kan',
      planExclTitle:'Exclusive — €11,99/maand', planExclPrice:'€11,99 / mnd',
      planExclB1:'Tot 5 uur / maand transcriptie + herschrijven', planExclB2:'Familiedelen (tot 4)', planExclB3:'Voor actieve vertellers',
      recordTitle:'Opnemen', recordBtn:'Opnemen', tabFree:'Vrij', tabGuided:'Geleid',
      promptsLabel:'Suggesties van vandaag', promptsRefresh:'Andere suggesties',
      notesLabel:'Notities (optioneel)', notesPlaceholder:'Snel notitie…',
      titleLabel:'Titel', titlePlaceholder:'Titel van verhaal',
      whenLabel:'Wanneer gebeurde dit?', whenPlaceholder:'bv. "zomer 1945", "begin 2018", "15 feb 1972"',
      photoLabel:'Foto toevoegen (optioneel)',
      transcriptLabel:'Transcript', transcriptEmpty:'Je woorden verschijnen hier…',
      saveStory:'Verhaal opslaan',
      storiesTitle:'Mijn verhalen',
      statStories:'Verhalen', statFamily:'Familieleden',
      libraryBlurb:'Je verhalen verschijnen hier in je privébibliotheek.',
      storiesEmpty:'Nog geen verhalen. Neem je eerste op!',
      storiesRewrite:'Herschrijf met AI', storiesExport:'Exporteren', storiesDelete:'Verwijderen',
      settingsTitle:'Instellingen',
      settingsAccount:'Account', settingsAccountCopy:'Beheer je login en gegevens.', settingsSignIn:'Inloggen',
      settingsSub:'Abonnement', settingsSubCopy:'Kies of wijzig je plan.',
      settingsBilling:'Facturatie', settingsBillingCopy:'Bekijk facturen en volgende verlenging.', settingsManageBilling:'Facturatie beheren',
      settingsFaq:'FAQ',
      faqQ1:'Is er een gratis plan?', faqQ2:'Welke talen worden ondersteund?', faqQ3:'Hoe wordt getranscribeerd?',
      settingsPlanDetails:'Abonnementsdetails'
    },

    es: {
      navHome:'Inicio', navLogin:'Acceder', navRecord:'Grabar', navStories:'Mis historias', navSettings:'Ajustes',
      brandKicker:'MEMOIR APP',
      footerAbout:'Memoir ayuda a las familias a capturar historias con voz, reescrituras con IA y una biblioteca familiar.',
      footerLegal:'Aviso legal y políticas',
      heroTitleA:'Preserva tus', heroTitleB:'recuerdos para siempre',
      heroBlurb:'Graba una vez para generaciones. Un toque, añade título y “cuándo ocurrió”, comparte con tu familia.',
      landingStartCardTitle:'Iniciar grabación',
      landingStartCardText:'Un toque para empezar. Título y “cuándo” más tarde. Whisper transcribe con claridad.',
      startRecording:'Iniciar grabación',
      landingStoriesCardTitle:'Mis historias',
      landingStoriesCardText:'Explora tu biblioteca privada, añade fotos, reescribe con IA y exporta.',
      viewStories:'Mis historias',
      featuresTitle:'Por qué Memoir',
      featuresIntro:'Tres motivos para elegir Memoir.',
      feat1Title:'Transcripción precisa (Whisper)',
      feat1Text:'Captura fiel con reconocimiento de voz multilingüe.',
      feat2Title:'Reescritura con IA para familias',
      feat2Text:'Convierte tu voz en historias pulidas y agradables de leer.',
      feat3Title:'Privado o compartido',
      feat3Text:'Mantén privado o comparte solo lectura; todo se sincroniza.',
      pricingTitle:'Precios',
      ctaTryFree:'Probar gratis', ctaSubscribe:'Suscribirse',
      planFreeTitle:'Gratis', planFreePrice:'€0',
      planFreeB1:'Hasta 10 historias', planFreeB2:'Máx. 2 minutos por historia', planFreeB3:'Biblioteca privada en tus dispositivos',
      planStoryTitle:'Storyteller — €6,99/mes', planStoryPrice:'€6,99 / mes',
      planStoryB1:'Hasta 2,5 h/mes de transcripción IA', planStoryB2:'Reescritura IA, exportación PDF/CSV', planStoryB3:'Procesamiento prioritario',
      planFamilyTitle:'Familiar — €8,99/mes', planFamilyPrice:'€8,99 / mes',
      planFamilyB1:'Todo en Storyteller', planFamilyB2:'Comparte con hasta 4 familiares (solo lectura)', planFamilyB3:'Invitación por email; revoca cuando quieras',
      planExclTitle:'Exclusive — €11,99/mes', planExclPrice:'€11,99 / mes',
      planExclB1:'Hasta 5 h/mes de transcripción + reescritura', planExclB2:'Uso familiar (hasta 4)', planExclB3:'Para narradores activos',
      recordTitle:'Grabar', recordBtn:'Grabar', tabFree:'Libre', tabGuided:'Guiado',
      promptsLabel:'Sugerencias de hoy', promptsRefresh:'Otras sugerencias',
      notesLabel:'Notas (opcional)', notesPlaceholder:'Añade una nota rápida…',
      titleLabel:'Título', titlePlaceholder:'Título de la historia',
      whenLabel:'¿Cuándo ocurrió?', whenPlaceholder:'p. ej. "verano de 1945", "inicios de 2018", "15 feb 1972"',
      photoLabel:'Añadir foto (opcional)',
      transcriptLabel:'Transcripción', transcriptEmpty:'Tus palabras aparecerán aquí…',
      saveStory:'Guardar historia',
      storiesTitle:'Mis historias',
      statStories:'Historias', statFamily:'Familiares',
      libraryBlurb:'Tus historias aparecerán aquí en tu biblioteca privada.',
      storiesEmpty:'Aún no hay historias. ¡Graba la primera!',
      storiesRewrite:'Reescribir con IA', storiesExport:'Exportar', storiesDelete:'Eliminar',
      settingsTitle:'Ajustes',
      settingsAccount:'Cuenta', settingsAccountCopy:'Gestiona inicio de sesión y datos.', settingsSignIn:'Acceder',
      settingsSub:'Suscripción', settingsSubCopy:'Elige o cambia tu plan.',
      settingsBilling:'Facturación', settingsBillingCopy:'Ver facturas y próxima renovación.', settingsManageBilling:'Gestionar facturación',
      settingsFaq:'FAQ',
      faqQ1:'¿Hay un plan gratuito?', faqQ2:'¿Qué idiomas están disponibles?', faqQ3:'¿Cómo se transcribe?',
      settingsPlanDetails:'Detalles de suscripción'
    }
  };

  function getLang(){
    return localStorage.getItem(STORE_KEY) || DEFAULT_LANG;
  }
  function t(key){
    const lang = getLang();
    const dict = strings[lang] || strings[DEFAULT_LANG];
    if (key in dict) return dict[key];
    if (key in strings.en) return strings.en[key];
    return null;
  }
  function applyAll(root=document){
    // text nodes
    root.querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); const v=t(k);
      if (v!=null) el.textContent=v;
    });
    // attribute translations: data-i18n-attr="placeholder:key, title:key2"
    root.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach(pair=>{
        const [attr,key]=pair.split(':').map(s=>s.trim());
        const v=t(key);
        if (attr && v!=null) el.setAttribute(attr,v);
      });
    });
  }
  function setLang(code){
    localStorage.setItem(STORE_KEY, code);
    applyAll(document);
    window.dispatchEvent(new CustomEvent('memoir:lang',{detail:{code}}));
  }

  // expose
  window.MEMOIR_I18N = { strings, getLang, setLang, t, applyAll };

  // initial apply
  document.addEventListener('DOMContentLoaded', ()=>applyAll(document));

  // re-apply when header/footer are injected (our loaders dispatch these)
  window.addEventListener('memoir:header-ready', e=>applyAll(e.detail?.root||document));
  window.addEventListener('memoir:footer-ready', e=>applyAll(e.detail?.root||document));
})();
