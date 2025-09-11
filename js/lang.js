// /js/lang.js
(function () {
  const STRINGS = {
    en: {
      // header
      navHome: 'Home',
      navLogin: 'Login',
      navRecord: 'Record',
      navStories: 'My Stories',

      // landing
      heroTitleA: 'Preserve Your',
      heroTitleB: 'Memories Forever',
      heroBlurb:
        'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      startRecording: 'Start Recording',
      viewStories: 'My Stories',

      // record
      recordTitle: 'Record',
      promptsLabel: "Today's suggested prompts",
      suggestOther: 'Suggest other prompts',
      notes: 'Notes (optional)',
      titleLabel: 'Title',
      whenLabel: 'When did this happen?',
      addPhoto: 'Add photo (optional)',
      transcript: 'Transcript',
      myStoriesBtn: 'My Stories',
      saveStory: 'Save story',

      // stories
      storiesHeader: 'My Stories',
      storiesBlurb:
        'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      storiesCount: 'Stories',
      famCount: 'Family Members',
      inviteLabel: 'Invite Family Member',
      invitePlaceholder: 'email@example.com',
      inviteBtn: 'Invite',

      // login
      loginHeader: 'Login',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign in',
      cancel: 'Cancel',
    },
    fr: {
      navHome: 'Accueil',
      navLogin: 'Connexion',
      navRecord: 'Enregistrer',
      navStories: 'Mes histoires',

      heroTitleA: 'Préservez vos',
      heroTitleB: 'souvenirs pour toujours',
      heroBlurb:
        'Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et “quand c’est arrivé”, puis partagez en toute sécurité avec votre famille.',
      startRecording: 'Commencer',
      viewStories: 'Mes histoires',

      recordTitle: 'Enregistrer',
      promptsLabel: 'Suggestions du jour',
      suggestOther: 'Suggérer autres sujets',
      notes: 'Notes (optionnel)',
      titleLabel: 'Titre',
      whenLabel: 'Quand est-ce arrivé ?',
      addPhoto: 'Ajouter une photo (optionnel)',
      transcript: 'Transcription',
      myStoriesBtn: 'Mes histoires',
      saveStory: 'Enregistrer',

      storiesHeader: 'Mes histoires',
      storiesBlurb:
        'Enregistrez une fois, gardez pour des générations. Commencez en un geste, ajoutez un titre et “quand c’est arrivé”, puis partagez en famille.',
      storiesCount: 'Histoires',
      famCount: 'Membres de la famille',
      inviteLabel: 'Inviter un membre de la famille',
      invitePlaceholder: 'email@exemple.com',
      inviteBtn: 'Inviter',

      loginHeader: 'Connexion',
      email: 'E-mail',
      password: 'Mot de passe',
      signIn: 'Se connecter',
      cancel: 'Annuler',
    },
    nl: {
      navHome: 'Home',
      navLogin: 'Inloggen',
      navRecord: 'Opnemen',
      navStories: 'Mijn verhalen',

      heroTitleA: 'Bewaar je',
      heroTitleB: 'herinneringen voor altijd',
      heroBlurb:
        'Neem één keer op en bewaar het voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met familie.',
      startRecording: 'Opname starten',
      viewStories: 'Mijn verhalen',

      recordTitle: 'Opnemen',
      promptsLabel: 'Suggesties van vandaag',
      suggestOther: 'Andere suggesties',
      notes: 'Notities (optioneel)',
      titleLabel: 'Titel',
      whenLabel: 'Wanneer gebeurde dit?',
      addPhoto: 'Foto toevoegen (optioneel)',
      transcript: 'Transcript',
      myStoriesBtn: 'Mijn verhalen',
      saveStory: 'Verhaal opslaan',

      storiesHeader: 'Mijn verhalen',
      storiesBlurb:
        'Neem één keer op en bewaar het voor generaties. Voeg titel en “wanneer het gebeurde” toe en deel privé met je familie.',
      storiesCount: 'Verhalen',
      famCount: 'Gezinsleden',
      inviteLabel: 'Gezinslid uitnodigen',
      invitePlaceholder: 'email@voorbeeld.com',
      inviteBtn: 'Uitnodigen',

      loginHeader: 'Inloggen',
      email: 'E-mail',
      password: 'Wachtwoord',
      signIn: 'Inloggen',
      cancel: 'Annuleren',
    },
    es: {
      navHome: 'Inicio',
      navLogin: 'Entrar',
      navRecord: 'Grabar',
      navStories: 'Mis historias',

      heroTitleA: 'Preserva tus',
      heroTitleB: 'recuerdos para siempre',
      heroBlurb:
        'Graba una vez y consérvalo para generaciones. Empieza con un toque, añade un título y “cuándo sucedió”, y comparte con tu familia de forma segura.',
      startRecording: 'Empezar',
      viewStories: 'Mis historias',

      recordTitle: 'Grabar',
      promptsLabel: 'Sugerencias de hoy',
      suggestOther: 'Sugerir otros temas',
      notes: 'Notas (opcional)',
      titleLabel: 'Título',
      whenLabel: '¿Cuándo ocurrió?',
      addPhoto: 'Añadir foto (opcional)',
      transcript: 'Transcripción',
      myStoriesBtn: 'Mis historias',
      saveStory: 'Guardar historia',

      storiesHeader: 'Mis historias',
      storiesBlurb:
        'Graba una vez, guarda para generaciones. Añade un título y “cuándo sucedió”, y comparte de forma privada con tu familia.',
      storiesCount: 'Historias',
      famCount: 'Familiares',
      inviteLabel: 'Invitar familiar',
      invitePlaceholder: 'correo@ejemplo.com',
      inviteBtn: 'Invitar',

      loginHeader: 'Entrar',
      email: 'Correo',
      password: 'Contraseña',
      signIn: 'Entrar',
      cancel: 'Cancelar',
    },
  };

  // IDs we auto-translate if present (no HTML edits needed)
  const ID_MAP = {
    // landing
    heroA: 'heroTitleA',
    heroB: 'heroTitleB',
    heroBlurb: 'heroBlurb',
    ctaStart: 'startRecording',
    ctaStories: 'viewStories',
    startLabel: 'startRecording',
    startTitle: 'startRecording',
    startBtn: 'startRecording',
    viewLabel: 'viewStories',
    viewTitle: 'viewStories',
    viewBtn: 'viewStories',

    // header nav (if those IDs exist in your header)
    navHome: 'navHome',
    navLogin: 'navLogin',
    navRecord: 'navRecord',
    navStories: 'navStories',

    // record
    recordH1: 'recordTitle',
    promptsLabel: 'promptsLabel',
    suggestOtherBtn: 'suggestOther',
    notesLabel: 'notes',
    titleLabel: 'titleLabel',
    whenLabel: 'whenLabel',
    addPhotoLabel: 'addPhoto',
    transcriptLabel: 'transcript',
    myStoriesBtn: 'myStoriesBtn',
    saveStoryBtn: 'saveStory',

    // stories
    storiesH1: 'storiesHeader',
    storiesIntro: 'storiesBlurb',
    storiesCountLabel: 'storiesCount',
    familyCountLabel: 'famCount',
    inviteLabel: 'inviteLabel',
    inviteBtn: 'inviteBtn',

    // login
    loginH1: 'loginHeader',
    emailLabel: 'email',
    passwordLabel: 'password',
    signInBtn: 'signIn',
    cancelBtn: 'cancel',
  };

  function applyToDom(code) {
    const dict = STRINGS[code] || STRINGS.en;

    // Update by IDs (if elements exist)
    Object.entries(ID_MAP).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el && dict[key]) el.textContent = dict[key];
    });

    // Placeholders via [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    // Simple content via [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
  }

  function setLang(code) {
    localStorage.setItem('memoir.lang', code);
    try { document.documentElement.setAttribute('lang', code); } catch {}
    applyToDom(code);
    window.dispatchEvent(new CustomEvent('memoir:lang', { detail: { code } }));
  }

  function getLang() {
    return localStorage.getItem('memoir.lang') || 'en';
  }

  // Expose globally
  window.MEMOIR_I18N = {
    strings: STRINGS,
    setLang,
    getLang,
    applyToDom,
  };

  // First paint
  document.addEventListener('DOMContentLoaded', () => {
    applyToDom(getLang());
  });
})();
