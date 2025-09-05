<!-- lang.js -->
<script>
window.I18N = {
  en: {
    nav_home: "Home",
    nav_record: "Record",
    nav_stories: "My Stories",
    nav_help: "Help",
    nav_login: "Login",

    // record
    guided: "Guided",
    free: "Free",
    todays_suggestions: "Today’s suggested prompts",
    refresh_prompts: "Suggest other prompts",
    title_label: "Title",
    when_label: "When did this happen?",
    start_recording: "Start Recording",
    stop_recording: "Stop Recording",
    transcript_placeholder: "Your words will appear here…",
    add_photo: "Add a photo (optional)",
    save_story: "Save story",

    // stories
    my_stories: "My Stories",
    you_have_x_stories: (n)=>`You have ${n} stor${n===1?'y':'ies'}.`,
    shared_with: "Shared with",
    invite_family: "Invite a family member",
    invite_email_ph: "Family member email",
    send_invite: "Send invite",

    // login
    sign_in: "Sign in",
    email: "Email",
    password: "Password",
    create_account: "Create account",
  },
  fr: {
    nav_home: "Accueil",
    nav_record: "Enregistrer",
    nav_stories: "Mes histoires",
    nav_help: "Aide",
    nav_login: "Se connecter",

    guided: "Guidé",
    free: "Libre",
    todays_suggestions: "Suggestions du jour",
    refresh_prompts: "Proposer d’autres sujets",
    title_label: "Titre",
    when_label: "Quand cela s’est-il passé ?",
    start_recording: "Commencer l’enregistrement",
    stop_recording: "Arrêter",
    transcript_placeholder: "Vos paroles apparaîtront ici…",
    add_photo: "Ajouter une photo (optionnel)",
    save_story: "Enregistrer l’histoire",

    my_stories: "Mes histoires",
    you_have_x_stories: (n)=>`Vous avez ${n} histoire${n>1?'s':''}.`,
    shared_with: "Partagé avec",
    invite_family: "Inviter un membre de la famille",
    invite_email_ph: "Email du membre",
    send_invite: "Envoyer l’invitation",

    sign_in: "Se connecter",
    email: "Email",
    password: "Mot de passe",
    create_account: "Créer un compte",
  },
  nl: {
    nav_home: "Home",
    nav_record: "Opnemen",
    nav_stories: "Mijn verhalen",
    nav_help: "Help",
    nav_login: "Inloggen",

    guided: "Begeleid",
    free: "Vrij",
    todays_suggestions: "Suggesties van vandaag",
    refresh_prompts: "Andere suggesties",
    title_label: "Titel",
    when_label: "Wanneer gebeurde dit?",
    start_recording: "Start opname",
    stop_recording: "Stop opname",
    transcript_placeholder: "Je woorden verschijnen hier…",
    add_photo: "Foto toevoegen (optioneel)",
    save_story: "Verhaal opslaan",

    my_stories: "Mijn verhalen",
    you_have_x_stories: (n)=>`Je hebt ${n} verhaal${n!==1?'len':''}.`,
    shared_with: "Gedeeld met",
    invite_family: "Familielid uitnodigen",
    invite_email_ph: "E-mail familielid",
    send_invite: "Uitnodiging versturen",

    sign_in: "Inloggen",
    email: "E-mail",
    password: "Wachtwoord",
    create_account: "Account aanmaken",
  },
  es: {
    nav_home: "Inicio",
    nav_record: "Grabar",
    nav_stories: "Mis historias",
    nav_help: "Ayuda",
    nav_login: "Entrar",

    guided: "Guiado",
    free: "Libre",
    todays_suggestions: "Sugerencias de hoy",
    refresh_prompts: "Sugerir otros temas",
    title_label: "Título",
    when_label: "¿Cuándo ocurrió?",
    start_recording: "Comenzar a grabar",
    stop_recording: "Detener",
    transcript_placeholder: "Tus palabras aparecerán aquí…",
    add_photo: "Añadir foto (opcional)",
    save_story: "Guardar historia",

    my_stories: "Mis historias",
    you_have_x_stories: (n)=>`Tienes ${n} historia${n!==1?'s':''}.`,
    shared_with: "Compartido con",
    invite_family: "Invitar a un familiar",
    invite_email_ph: "Correo del familiar",
    send_invite: "Enviar invitación",

    sign_in: "Iniciar sesión",
    email: "Correo",
    password: "Contraseña",
    create_account: "Crear cuenta",
  }
};

window.getLang = ()=> localStorage.getItem('lang') || 'en';
window.setLang = (code)=>{ localStorage.setItem('lang', code); location.reload(); };

window.t = (key, ...args)=>{
  const L = I18N[getLang()] || I18N.en;
  const v = L[key];
  return typeof v==='function' ? v(...args) : (v || key);
};

window.applyI18N = ()=>{
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
};
</script>
