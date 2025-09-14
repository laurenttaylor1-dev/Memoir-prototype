<script>
/* global window, document, localStorage */

/**
 * MEMOIR_I18N: simple i18n with:
 *  - MEMOIR_I18N.t(key)
 *  - MEMOIR_I18N.getLang()
 *  - MEMOIR_I18N.setLang(code)
 *  - MEMOIR_I18N.applyAll(root=document) -> applies data-i18n / data-i18n-html
 *  Emits window event: new CustomEvent('memoir:lang', { detail: { code } })
 */

(function () {
  const LS_KEY = 'memoir.lang';
  const DEFAULT = 'en';

  // ---- Strings (add/extend as needed) ----
  const STR = {
    en: {
      // Header
      navHome: 'Home',
      navLogin: 'Login',
      navRecord: 'Record',
      navStories: 'My Stories',
      brandKicker: 'Memoir App',
      brandTagline: 'Preserve your memories forever',
      legal: 'Legal & Policies',
      aboutMemoir: 'Memoir helps families capture their stories with clear transcription, beautiful rewrites, and private sharing.',
      // Landing (hero)
      heroLine1: 'Preserve Your',
      heroLine2: 'Memories Forever',
      heroBlurb: 'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.',
      startRecording: 'Start Recording',
      startCopy: 'Begin telling your story in a single tap. Add a title and approximate date later.',
      viewStories: 'My Stories',
      storiesCopy: 'See your private library, add photos, rewrite with AI for a literary, cohesive chapter, and export.',
      // Features
      featuresTitle: 'Why Memoir?',
      featuresIntro: 'Three ways we help you turn spoken memories into a beautiful legacy.',
      f1Title: 'Crystal-clear transcription (Whisper)',
      f1Copy: 'We use advanced AI speech recognition (OpenAI Whisper) for accurate Dutch, French, Spanish and English — even when your connection drops. Audio is saved and transcribed as soon as you’re back online.',
      f2Title: 'Ghostwriter rewrite',
      f2Copy: 'With one click, transform a raw transcript into a warm, vivid, cohesive chapter your family will love — keeping your voice and facts intact.',
      f3Title: 'Private library & sharing',
      f3Copy: 'Your stories are stored safely in the cloud. Invite family to follow along or collaborate. You remain in control of what’s shared.',
      // Pricing
      pricingTitle: 'Plans',
      pricingIntro: 'Choose the plan that fits your journey. You can also upgrade later from Settings.',
      pGetStarted: 'Get Started',
      pSubscribe: 'Subscribe',
      pFreeName: 'Free',
      pFreePrice: '€0 / month',
      pFreeListHTML: '<li>Basic recording</li><li>Cloud library</li><li>Local exports</li>',
      pStorytellerName: 'Storyteller',
      pStorytellerPrice: '€6.99 / month',
      pStorytellerListHTML: '<li>AI transcription (Whisper)</li><li>Ghostwriter rewrite</li><li>Export to PDF/Docx</li>',
      pFamilyName: 'Family',
      pFamilyPrice: '€8.99 / month',
      pFamilyListHTML: '<li>All Storyteller features</li><li>Share with up to 4 readers</li><li>Private family feed</li>',
      pExclusiveName: 'Exclusive',
      pExclusivePrice: '€11.99 / month',
      pExclusiveListHTML: '<li>5 hours transcription / month</li><li>Priority rewrite quality</li><li>Priority support</li>',
      // Record
      pageRecordTitle: 'Record',
      recordSuggested: "Today's suggested prompts",
      recordRefresh: 'Suggest other prompts',
      recordNotes: 'Notes (optional)',
      recordTitleLbl: 'Title',
      recordWhenLbl: 'When did this happen?',
      recordPhotoLbl: 'Add photo (optional)',
      recordTranscriptLbl: 'Transcript',
      recordSave: 'Save story',
      // Stories
      storiesTitle: 'My Stories',
      storiesEmpty: 'Your stories will all be added to this private library.',
      storiesRewrite: 'Rewrite (AI)',
      storiesExport: 'Export',
      storiesDelete: 'Delete',
      // Settings (labels only; content page will fill details)
      settingsTitle: 'Settings',
    },

    fr: {
      navHome: 'Accueil',
      navLogin: 'Connexion',
      navRecord: 'Enregistrer',
      navStories: 'Mes Histoires',
      brandKicker: 'Application Memoir',
      brandTagline: 'Préservez vos souvenirs pour toujours',
      legal: 'Mentions & Politiques',
      aboutMemoir: 'Memoir aide les familles à capturer leurs histoires avec une transcription claire, de belles réécritures et un partage privé.',
      heroLine1: 'Préservez Vos',
      heroLine2: 'Souvenirs Pour Toujours',
      heroBlurb: 'Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et “quand cela s’est passé”, partagez en toute sécurité.',
      startRecording: 'Commencer',
      startCopy: 'Commencez à raconter en un geste. Ajoutez un titre et une date approximative plus tard.',
      viewStories: 'Mes Histoires',
      storiesCopy: 'Votre bibliothèque privée : ajoutez des photos, réécrivez avec l’IA pour un chapitre littéraire et exportez.',
      featuresTitle: 'Pourquoi Memoir ?',
      featuresIntro: 'Trois façons de transformer vos paroles en un bel héritage.',
      f1Title: 'Transcription précise (Whisper)',
      f1Copy: 'Nous utilisons OpenAI Whisper pour un français, néerlandais, espagnol et anglais fiables — même hors ligne. L’audio est enregistré et transcrit dès le retour du réseau.',
      f2Title: 'Réécriture « ghostwriter »',
      f2Copy: 'En un clic, transformez un brouillon en un chapitre chaleureux et cohérent, tout en gardant votre voix.',
      f3Title: 'Bibliothèque privée & partage',
      f3Copy: 'Histoires stockées en sécurité. Invitez vos proches à suivre. Vous gardez le contrôle.',
      pricingTitle: 'Abonnements',
      pricingIntro: 'Choisissez la formule qui vous convient. Vous pouvez aussi évoluer dans Réglages.',
      pGetStarted: 'Commencer',
      pSubscribe: "S'abonner",
      pFreeName: 'Gratuit',
      pFreePrice: '0 € / mois',
      pFreeListHTML: '<li>Enregistrement de base</li><li>Bibliothèque cloud</li><li>Exports locaux</li>',
      pStorytellerName: 'Conteur',
      pStorytellerPrice: '6,99 € / mois',
      pStorytellerListHTML: '<li>Transcription IA (Whisper)</li><li>Réécriture littéraire</li><li>Export PDF/Docx</li>',
      pFamilyName: 'Famille',
      pFamilyPrice: '8,99 € / mois',
      pFamilyListHTML: '<li>Toutes les fonctions Conteur</li><li>Partage jusqu’à 4 lecteurs</li><li>Flux familial privé</li>',
      pExclusiveName: 'Exclusif',
      pExclusivePrice: '11,99 € / mois',
      pExclusiveListHTML: '<li>5 h de transcription / mois</li><li>Qualité de réécriture prioritaire</li><li>Support prioritaire</li>',
      pageRecordTitle: 'Enregistrer',
      recordSuggested: 'Prompts suggérés du jour',
      recordRefresh: 'Suggérer d’autres prompts',
      recordNotes: 'Notes (optionnel)',
      recordTitleLbl: 'Titre',
      recordWhenLbl: 'Quand cela s’est-il passé ?',
      recordPhotoLbl: 'Ajouter une photo (optionnel)',
      recordTranscriptLbl: 'Transcription',
      recordSave: 'Enregistrer l’histoire',
      storiesTitle: 'Mes Histoires',
      storiesEmpty: 'Vos histoires apparaîtront ici dans votre bibliothèque privée.',
      storiesRewrite: 'Réécrire (IA)',
      storiesExport: 'Exporter',
      storiesDelete: 'Supprimer',
      settingsTitle: 'Réglages',
    },

    nl: {
      navHome: 'Home',
      navLogin: 'Inloggen',
      navRecord: 'Opnemen',
      navStories: 'Mijn Verhalen',
      brandKicker: 'Memoir App',
      brandTagline: 'Bewaar je herinneringen voor altijd',
      legal: 'Juridisch & Beleid',
      aboutMemoir: 'Memoir helpt families verhalen vast te leggen met heldere transcripties, mooie herschrijvingen en privé delen.',
      heroLine1: 'Bewaar Je',
      heroLine2: 'Herinneringen Voor Altijd',
      heroBlurb: 'Één keer opnemen, generaties bewaren. Start met één tik, voeg later een titel en “wanneer het gebeurde” toe, deel veilig met familie.',
      startRecording: 'Start Opname',
      startCopy: 'Begin direct met vertellen. Voeg later titel en datum toe.',
      viewStories: 'Mijn Verhalen',
      storiesCopy: 'Bekijk je privé bibliotheek, voeg foto’s toe, herschrijf met AI tot een mooi hoofdstuk en exporteer.',
      featuresTitle: 'Waarom Memoir?',
      featuresIntro: 'Drie manieren om gesproken herinneringen om te zetten in een blijvend verhaal.',
      f1Title: 'Haarscherpe transcriptie (Whisper)',
      f1Copy: 'OpenAI Whisper voor Nederlands, Frans, Spaans en Engels — ook bij haperende verbinding. Audio wordt opgeslagen en later getranscribeerd.',
      f2Title: 'Ghostwriter-herschrijving',
      f2Copy: 'Met één klik wordt een ruwe tekst een warm, beeldend en samenhangend hoofdstuk — in jouw stem.',
      f3Title: 'Privé bibliotheek & delen',
      f3Copy: 'Je verhalen staan veilig in de cloud. Nodig familie uit om mee te lezen. Jij houdt de regie.',
      pricingTitle: 'Pakketten',
      pricingIntro: 'Kies wat bij je past. Upgraden kan later in Instellingen.',
      pGetStarted: 'Aan de slag',
      pSubscribe: 'Abonneren',
      pFreeName: 'Gratis',
      pFreePrice: '€0 / maand',
      pFreeListHTML: '<li>Basisopname</li><li>Cloudbibliotheek</li><li>Lokale export</li>',
      pStorytellerName: 'Verteller',
      pStorytellerPrice: '€6,99 / maand',
      pStorytellerListHTML: '<li>AI-transcriptie (Whisper)</li><li>Herschrijven met AI</li><li>Export naar PDF/Docx</li>',
      pFamilyName: 'Familie',
      pFamilyPrice: '€8,99 / maand',
      pFamilyListHTML: '<li>Alles van Verteller</li><li>Delen met 4 lezers</li><li>Privé familiefeed</li>',
      pExclusiveName: 'Exclusief',
      pExclusivePrice: '€11,99 / maand',
      pExclusiveListHTML: '<li>5 uur transcriptie / maand</li><li>Prioriteit herschrijven</li><li>Prioriteitsupport</li>',
      pageRecordTitle: 'Opnemen',
      recordSuggested: 'Suggesties van vandaag',
      recordRefresh: 'Andere suggesties',
      recordNotes: 'Notities (optioneel)',
      recordTitleLbl: 'Titel',
      recordWhenLbl: 'Wanneer gebeurde dit?',
      recordPhotoLbl: 'Foto toevoegen (optioneel)',
      recordTranscriptLbl: 'Transcriptie',
      recordSave: 'Verhaal opslaan',
      storiesTitle: 'Mijn Verhalen',
      storiesEmpty: 'Je verhalen komen hier in je privébibliotheek te staan.',
      storiesRewrite: 'Herschrijf (AI)',
      storiesExport: 'Exporteren',
      storiesDelete: 'Verwijderen',
      settingsTitle: 'Instellingen',
    },

    es: {
      navHome: 'Inicio',
      navLogin: 'Acceder',
      navRecord: 'Grabar',
      navStories: 'Mis Historias',
      brandKicker: 'Aplicación Memoir',
      brandTagline: 'Conserva tus recuerdos para siempre',
      legal: 'Legal y Políticas',
      aboutMemoir: 'Memoir ayuda a las familias a capturar sus historias con transcripción clara, reescrituras bellas y uso privado compartido.',
      heroLine1: 'Conserva Tus',
      heroLine2: 'Recuerdos Para Siempre',
      heroBlurb: 'Graba una vez, guarda para generaciones. Empieza con un toque, añade un título y “cuándo ocurrió” y comparte con seguridad.',
      startRecording: 'Empezar a grabar',
      startCopy: 'Empieza a contar con un toque. Añade título y fecha aproximada después.',
      viewStories: 'Mis Historias',
      storiesCopy: 'Tu biblioteca privada, añade fotos, reescribe con IA en un capítulo literario y exporta.',
      featuresTitle: '¿Por qué Memoir?',
      featuresIntro: 'Tres maneras de convertir recuerdos hablados en un legado hermoso.',
      f1Title: 'Transcripción nítida (Whisper)',
      f1Copy: 'OpenAI Whisper para español, francés, neerlandés e inglés — incluso con conexión inestable. El audio se guarda y se transcribe cuando vuelves a estar online.',
      f2Title: 'Reescritura de autor',
      f2Copy: 'Con un clic, transforma un borrador en un capítulo cálido y coherente — manteniendo tu voz.',
      f3Title: 'Biblioteca privada y compartir',
      f3Copy: 'Historias seguras en la nube. Invita a la familia a seguirte. Tú controlas lo que se comparte.',
      pricingTitle: 'Planes',
      pricingIntro: 'Elige el plan que se adapte a ti. También puedes mejorar desde Ajustes.',
      pGetStarted: 'Empezar',
      pSubscribe: 'Suscribirse',
      pFreeName: 'Gratis',
      pFreePrice: '€0 / mes',
      pFreeListHTML: '<li>Grabación básica</li><li>Biblioteca en la nube</li><li>Exportaciones locales</li>',
      pStorytellerName: 'Narrador',
      pStorytellerPrice: '€6.99 / mes',
      pStorytellerListHTML: '<li>Transcripción IA (Whisper)</li><li>Reescritura con IA</li><li>Exportar a PDF/Docx</li>',
      pFamilyName: 'Familiar',
      pFamilyPrice: '€8.99 / mes',
      pFamilyListHTML: '<li>Todo del Narrador</li><li>Compartir con 4 lectores</li><li>Feed familiar privado</li>',
      pExclusiveName: 'Exclusivo',
      pExclusivePrice: '€11.99 / mes',
      pExclusiveListHTML: '<li>5 horas de transcripción / mes</li><li>Reescritura prioritaria</li><li>Soporte prioritario</li>',
      pageRecordTitle: 'Grabar',
      recordSuggested: 'Sugerencias de hoy',
      recordRefresh: 'Otras sugerencias',
      recordNotes: 'Notas (opcional)',
      recordTitleLbl: 'Título',
      recordWhenLbl: '¿Cuándo ocurrió?',
      recordPhotoLbl: 'Añadir foto (opcional)',
      recordTranscriptLbl: 'Transcripción',
      recordSave: 'Guardar historia',
      storiesTitle: 'Mis Historias',
      storiesEmpty: 'Tus historias aparecerán aquí en tu biblioteca privada.',
      storiesRewrite: 'Reescribir (IA)',
      storiesExport: 'Exportar',
      storiesDelete: 'Eliminar',
      settingsTitle: 'Ajustes',
    }
  };

  const MEMOIR_I18N = {
    strings: STR,
    t(key) {
      const lang = this.getLang();
      return (STR[lang] && STR[lang][key]) ?? (STR.en && STR.en[key]) ?? key;
    },
    getLang() {
      return localStorage.getItem(LS_KEY) || DEFAULT;
    },
    setLang(code) {
      const lang = STR[code] ? code : DEFAULT;
      localStorage.setItem(LS_KEY, lang);
      // Auto apply everywhere
      this.applyAll();
      // Emit a global event so pages can react
      const ev = new CustomEvent('memoir:lang', { detail: { code: lang } });
      window.dispatchEvent(ev);
    },
    applyAll(root) {
      const r = root || document;
      // text content
      r.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = this.t(key);
        if (val != null) el.textContent = val;
      });
      // innerHTML content
      r.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const val = this.t(key);
        if (val != null) el.innerHTML = val;
      });
    }
  };

  // Expose & initialize
  window.MEMOIR_I18N = MEMOIR_I18N;
  // First paint: apply translations already on the page
  document.addEventListener('DOMContentLoaded', () => {
    MEMOIR_I18N.applyAll();
  });
})();
</script>
