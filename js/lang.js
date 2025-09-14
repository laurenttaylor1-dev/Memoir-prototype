/* Memoir i18n — baseline, robust, no dependencies
   - Stores language in localStorage ("memoir.lang")
   - Applies translations to any element with:
       data-i18n="key"
       data-i18n-attr="placeholder:key;title:otherKey"
   - Emits:  memoir:lang   with {detail:{code}}
   - Exposes: window.MEMOIR_I18N  { t, setLang, getLang, apply, strings }
*/
(function () {
  const STORE = 'memoir.lang';
  const DEFAULT = 'en';

  const strings = {
    en: {
      // header
      navHome: 'Home', navLogin: 'Login', navRecord: 'Record', navStories: 'My Stories',
      langEnglish: 'English', langFrench: 'Français', langDutch: 'Nederlands', langSpanish: 'Español',

      // footer
      footerAbout: 'Memoir helps families capture life stories with beautiful voice capture, AI transcription, and a private library.',
      footerLegal: 'Legal & Policies',

      // landing hero + actions
      heroKicker: 'MEMOIR APP',
      heroTitleA: 'Preserve Your', heroTitleB: 'Memories Forever',
      heroBlurb: 'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      landingStartCardTitle: 'Start Recording',
      landingStartCardText: 'One tap to begin. Add a title and “when it happened” later.',
      landingStartBtn: 'Start Recording',
      landingStoriesCardTitle: 'View My Stories',
      landingStoriesCardText: 'Browse, rewrite with AI, export, and share with your family.',
      landingStoriesBtn: 'My Stories',

      // features
      featuresTitle: 'Why Memoir',
      featuresIntro: 'Three reasons families choose Memoir.',
      f1Title: 'Accurate transcription', f1Copy: 'Capture every word with Whisper-powered transcription for high accuracy and clarity.',
      f2Title: 'AI rewrite for families', f2Copy: 'Turn your spoken words into polished, engaging stories — like real literature your family will love to read.',
      f3Title: 'Private by default', f3Copy: 'Your stories sync across your devices. Share read-only with family when you’re ready.',

      // pricing cards
      pricingTitle: 'Pricing',
      planFree: 'Free', planFreePrice: '€0',
      planFreeBul1: 'Up to 10 stories', planFreeBul2: 'Max 2 minutes transcription per story', planFreeBul3: 'Private library on all your devices',

      planStoryteller: 'Storyteller — €6.99/month', planStorytellerPrice: '€6.99 / mo',
      planStBul1: 'Up to 2.5 hours / month of AI transcription',
      planStBul2: 'AI Rewrite (polish stories), export to PDF/CSV',
      planStBul3: 'Priority processing',

      planFamily: 'Family — €8.99/month', planFamilyPrice: '€8.99 / mo',
      planFamBul1: 'Everything in Storyteller',
      planFamBul2: 'Share your library with up to 4 read-only family members',
      planFamBul3: 'Invite by email; revoke anytime',

      planExclusive: 'Exclusive — €11.99/month', planExclusivePrice: '€11.99 / mo',
      planExBul1: 'Up to 5 hours / month of AI transcription + rewrite',
      planExBul2: 'Family sharing (up to 4)',
      planExBul3: 'Best for active storytellers',
      planSubscribe: 'Subscribe',

      // stories
      storiesTitle: 'My Stories',
      storiesEmpty: 'No stories yet. Your stories will all be added to this private library.',
      storiesRewrite: 'AI Rewrite', storiesExport: 'Export', storiesDelete: 'Delete',

      // record
      recordTitle: 'Record',
      recordFree: 'FREE', recordGuided: 'GUIDED',
      recordOther: 'Other', recordNotes: 'Notes (optional)',
      recordTitleLabel: 'Title', recordWhenLabel: 'When did this happen?',
      recordPhotoLabel: 'Add photo (optional)', recordSave: 'Save story',
      recordTranscript: 'Transcript', recordPromptRefresh: 'Suggest other prompts',

      // login
      loginTitle: 'Login',
      loginEmailPH: 'you@example.com', loginPasswordPH: 'Password', loginBtn: 'Sign in',

      // settings (labels only)
      settingsTitle: 'Settings',
      settingsLanguage: 'Language',
      settingsAccount: 'Account',
      settingsPlan: 'Your Plan',
      settingsBilling: 'Billing',
      settingsLegal: 'Legal & Policies',
      settingsPlansMore: 'Plan details'
    },

    fr: {
      navHome: 'Accueil', navLogin: 'Connexion', navRecord: 'Enregistrer', navStories: 'Mes histoires',
      langEnglish: 'Anglais', langFrench: 'Français', langDutch: 'Néerlandais', langSpanish: 'Espagnol',
      footerAbout: 'Memoir aide les familles à capturer leurs histoires de vie avec une belle prise de son, une transcription par IA et une bibliothèque privée.',
      footerLegal: 'Mentions légales',
      heroKicker: 'MEMOIR APP',
      heroTitleA: 'Préservez vos', heroTitleB: 'souvenirs pour toujours',
      heroBlurb: 'Enregistrez une fois, gardez pour des générations. Un seul tap, ajoutez un titre et “quand c’est arrivé”, puis partagez en toute sécurité avec votre famille.',
      landingStartCardTitle: 'Commencer un enregistrement',
      landingStartCardText: 'Un tap pour commencer. Ajoutez le titre et “quand” plus tard.',
      landingStartBtn: 'Commencer',
      landingStoriesCardTitle: 'Voir mes histoires',
      landingStoriesCardText: 'Parcourez, réécrivez avec l’IA, exportez et partagez en famille.',
      landingStoriesBtn: 'Mes histoires',
      featuresTitle: 'Pourquoi Memoir',
      featuresIntro: 'Trois raisons de choisir Memoir.',
      f1Title: 'Transcription précise', f1Copy: 'Whisper pour une grande fidélité et clarté.',
      f2Title: 'Réécriture IA pour la famille', f2Copy: 'Des textes chaleureux et lisibles à partir de votre voix.',
      f3Title: 'Privé par défaut', f3Copy: 'Synchronisé sur vos appareils, partage en lecture seule.',
      pricingTitle: 'Tarifs',
      planFree: 'Gratuit', planFreePrice: '0 €',
      planFreeBul1: 'Jusqu’à 10 histoires', planFreeBul2: '2 min max de transcription par histoire', planFreeBul3: 'Bibliothèque privée sur tous vos appareils',
      planStoryteller: 'Storyteller — 6,99 €/mois', planStorytellerPrice: '6,99 € / mois',
      planStBul1: 'Jusqu’à 2,5 h / mois de transcription IA', planStBul2: 'Réécriture IA, export PDF/CSV', planStBul3: 'Traitement prioritaire',
      planFamily: 'Famille — 8,99 €/mois', planFamilyPrice: '8,99 € / mois',
      planFamBul1: 'Tout Storyteller', planFamBul2: 'Partage avec 4 proches (lecture seule)', planFamBul3: 'Invitation par email, révocation à tout moment',
      planExclusive: 'Exclusive — 11,99 €/mois', planExclusivePrice: '11,99 € / mois',
      planExBul1: 'Jusqu’à 5 h / mois de transcription + réécriture', planExBul2: 'Partage familial (jusqu’à 4)', planExBul3: 'Idéal pour conteurs actifs',
      planSubscribe: 'S’abonner',
      storiesTitle: 'Mes histoires',
      storiesEmpty: 'Aucune histoire pour l’instant. Elles seront ajoutées ici dans votre bibliothèque privée.',
      storiesRewrite: 'Réécriture IA', storiesExport: 'Exporter', storiesDelete: 'Supprimer',
      recordTitle: 'Enregistrer', recordFree: 'LIBRE', recordGuided: 'GUIDÉ',
      recordOther: 'Autre', recordNotes: 'Notes (optionnel)',
      recordTitleLabel: 'Titre', recordWhenLabel: 'Quand est-ce arrivé ?',
      recordPhotoLabel: 'Ajouter une photo (optionnel)', recordSave: 'Enregistrer l’histoire',
      recordTranscript: 'Transcription', recordPromptRefresh: 'Proposer d’autres sujets',
      loginTitle: 'Connexion', loginEmailPH: 'vous@exemple.com', loginPasswordPH: 'Mot de passe', loginBtn: 'Se connecter',
      settingsTitle: 'Paramètres', settingsLanguage: 'Langue', settingsAccount: 'Compte', settingsPlan: 'Votre offre', settingsBilling: 'Facturation', settingsLegal: 'Mentions légales', settingsPlansMore: 'Détails des offres'
    },

    nl: { /* keep short for brevity */ ... },
    es: { /* keep short for brevity */ ... }
  };

  function valid(code){ return !!strings[code]; }
  function current(){ return localStorage.getItem(STORE) || (navigator.language||'en').slice(0,2) || DEFAULT; }
  function t(key, code){ const lang = strings[code || getLang()] || strings[DEFAULT]; return lang[key] ?? (strings[DEFAULT][key] ?? key); }

  function apply(root){
    const doc = root || document;
    doc.querySelectorAll('[data-i18n]').forEach(el=>{
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    doc.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      const spec = el.getAttribute('data-i18n-attr'); // e.g. "placeholder:loginEmailPH;title:loginTitle"
      spec.split(';').map(s=>s.trim()).filter(Boolean).forEach(pair=>{
        const [attr,key] = pair.split(':').map(s=>s.trim());
        if(attr && key){ el.setAttribute(attr, t(key)); }
      });
    });
  }

  function setLang(code){
    if(!valid(code)) code = DEFAULT;
    localStorage.setItem(STORE, code);
    document.documentElement.lang = code;
    apply(document);
    window.dispatchEvent(new CustomEvent('memoir:lang', { detail:{ code } }));
  }

  function getLang(){ const code = current(); return valid(code) ? code : DEFAULT; }

  // Expose
  window.MEMOIR_I18N = { t, setLang, getLang, apply, strings };

  // Initial apply
  document.addEventListener('DOMContentLoaded', () => {
    if(!valid(current())) localStorage.setItem(STORE, DEFAULT);
    document.documentElement.lang = getLang();
    apply(document);
  });
})();
