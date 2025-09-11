<script>
/* lang.js — shared i18n bus + strings */
(function () {
  const LS_KEY = 'memoir.lang';

  const strings = {
    en: {
      /* nav */
      nav_home:'Home', nav_login:'Login', nav_record:'Record', nav_stories:'My Stories',
      /* landing */
      heroTitleA:'Preserve Your', heroTitleB:'Memories Forever',
      heroBlurb:'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      startRecording:'Start Recording', viewStories:'My Stories',
      /* record */
      promptsHdr:"Today's suggested prompts", btnShuffle:'Suggest other prompts',
      notesLabel:'Notes (optional)', notesPH:'Add a quick note…',
      titleLabel:'Title', titlePH:'Story title',
      whenLabel:'When did this happen?', whenPH:'e.g. "summer 1945", "early 2018", "15 Feb 1972"',
      addPhotoLabel:'Add photo (optional)', transcriptLabel:'Transcript',
      transcriptPH:'Your words will appear here…', saveStory:'Save story',
      asrRecording:'Recording… transcription will appear live when online.',
      asrListening:'Listening…', asrOffline:'Offline or server unavailable — audio will be saved and sent later.',
      /* stories */
      storiesLead:'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      storiesCountLabel:'Stories', familyCountLabel:'Family Members',
      inviteLabel:'Invite Family Member', invitePH:'email@example.com', inviteBtn:'Invite',
      inviteHint:'They will receive a read-only link to view and listen.',
      listLabel:'My Stories', emptyState:'No stories yet. Record your first one!'
    },

    fr: {
      nav_home:'Accueil', nav_login:'Connexion', nav_record:'Enregistrer', nav_stories:'Mes histoires',
      heroTitleA:'Préservez Vos', heroTitleB:'Souvenirs Pour Toujours',
      heroBlurb:'Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un tap, ajoutez un titre et “quand c’est arrivé”, puis partagez en toute sécurité avec votre famille.',
      startRecording:'Commencer', viewStories:'Mes histoires',
      promptsHdr:'Suggestions du jour', btnShuffle:'Suggérer d’autres idées',
      notesLabel:'Notes (optionnel)', notesPH:'Ajoutez une note rapide…',
      titleLabel:'Titre', titlePH:'Titre de l’histoire',
      whenLabel:'Quand cela est-il arrivé ?', whenPH:'ex. "été 1945", "début 2018", "15 fév 1972"',
      addPhotoLabel:'Ajouter une photo (optionnel)', transcriptLabel:'Transcription',
      transcriptPH:'Vos mots apparaîtront ici…', saveStory:'Enregistrer',
      asrRecording:'En cours… la transcription apparaîtra en ligne.',
      asrListening:'Écoute…', asrOffline:'Hors ligne — l’audio sera sauvegardé et envoyé plus tard.',
      storiesLead:'Enregistrez une fois, gardez pour des générations…',
      storiesCountLabel:'Histoires', familyCountLabel:'Membres de la famille',
      inviteLabel:'Inviter un membre de la famille', invitePH:'email@exemple.com', inviteBtn:'Inviter',
      inviteHint:'Ils recevront un lien en lecture seule.',
      listLabel:'Mes histoires', emptyState:'Pas encore d’histoires. Enregistrez la première !'
    },

    nl: {
      nav_home:'Home', nav_login:'Inloggen', nav_record:'Opnemen', nav_stories:'Mijn verhalen',
      heroTitleA:'Bewaar Jouw', heroTitleB:'Herinneringen Voor Altijd',
      heroBlurb:'Neem één keer op, bewaar voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met familie.',
      startRecording:'Opname starten', viewStories:'Mijn verhalen',
      promptsHdr:'Suggesties van vandaag', btnShuffle:'Andere suggesties',
      notesLabel:'Notities (optioneel)', notesPH:'Snel een notitie…',
      titleLabel:'Titel', titlePH:'Titel van het verhaal',
      whenLabel:'Wanneer gebeurde dit?', whenPH:'bv. "zomer 1945", "begin 2018", "15 feb 1972"',
      addPhotoLabel:'Foto toevoegen (optioneel)', transcriptLabel:'Transcriptie',
      transcriptPH:'Je woorden verschijnen hier…', saveStory:'Verhaal opslaan',
      asrRecording:'Opnemen… transcript verschijnt live zodra je online bent.',
      asrListening:'Luisteren…', asrOffline:'Offline — audio wordt opgeslagen en later verzonden.',
      storiesLead:'Neem één keer op, bewaar voor generaties…',
      storiesCountLabel:'Verhalen', familyCountLabel:'Gezinsleden',
      inviteLabel:'Gezinslid uitnodigen', invitePH:'email@voorbeeld.com', inviteBtn:'Uitnodigen',
      inviteHint:'Ze ontvangen een link met alleen-lezen rechten.',
      listLabel:'Mijn verhalen', emptyState:'Nog geen verhalen. Begin met opnemen!'
    },

    es: {
      nav_home:'Inicio', nav_login:'Acceder', nav_record:'Grabar', nav_stories:'Mis historias',
      heroTitleA:'Conserva Tus', heroTitleB:'Recuerdos Para Siempre',
      heroBlurb:'Graba una vez y consérvalo para generaciones. Empieza en un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura con tu familia.',
      startRecording:'Empezar', viewStories:'Mis historias',
      promptsHdr:'Sugerencias de hoy', btnShuffle:'Sugerir otras',
      notesLabel:'Notas (opcional)', notesPH:'Añade una nota rápida…',
      titleLabel:'Título', titlePH:'Título de la historia',
      whenLabel:'¿Cuándo pasó?', whenPH:'p. ej. "verano de 1945", "inicios de 2018", "15 feb 1972"',
      addPhotoLabel:'Añadir foto (opcional)', transcriptLabel:'Transcripción',
      transcriptPH:'Tus palabras aparecerán aquí…', saveStory:'Guardar',
      asrRecording:'Grabando… la transcripción aparecerá cuando estés en línea.',
      asrListening:'Escuchando…', asrOffline:'Sin conexión — el audio se guardará y se enviará más tarde.',
      storiesLead:'Graba una vez y consérvalo para generaciones…',
      storiesCountLabel:'Historias', familyCountLabel:'Familiares',
      inviteLabel:'Invitar familiar', invitePH:'correo@ejemplo.com', inviteBtn:'Invitar',
      inviteHint:'Recibirá un enlace de solo lectura.',
      listLabel:'Mis historias', emptyState:'Todavía no hay historias. ¡Graba la primera!'
    }
  };

  function getLang() {
    return localStorage.getItem(LS_KEY) || 'en';
  }
  function setLang(code) {
    const lang = strings[code] ? code : 'en';
    localStorage.setItem(LS_KEY, lang);
    const ev = new CustomEvent('memoir:lang', { detail: { code: lang }});
    window.dispatchEvent(ev);
  }

  // expose
  window.MEMOIR_I18N = { strings, getLang, setLang };
})();
</script>
