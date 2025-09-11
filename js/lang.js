<script>
// Global i18n helper ---------------------------------------------------------
(function(){
  const LS_KEY = 'memoir_lang';
  const getLang = () => localStorage.getItem(LS_KEY) || 'en';
  const setLang = (code) => { localStorage.setItem(LS_KEY, code); };

  // Strings used across pages/partials
  const STR = {
    en: {
      // Header
      navHome:"Home", navLogin:"Login", navRecord:"Record", navStories:"My Stories",
      langEnglish:"English", langFrench:"Français", langDutch:"Nederlands", langSpanish:"Español",

      // Footer blocks
      footerFaqTitle:"FAQ",
      footerQ1:"Is there a free plan?",
      footerA1:"Yes, you can try the app for free before upgrading.",
      footerQ2:"Which languages are supported?",
      footerA2:"English, Français, Nederlands, Español (more coming).",
      footerQ3:"How is transcription done?",
      footerA3:"Server-side Whisper for high accuracy; works offline then syncs later.",
      footerPricingTitle:"Pricing",
      footerAboutTitle:"About",
      footerAboutCopy:"Memoir helps families capture life stories with beautiful voice capture, AI transcription, and a private library.",
      footerUpgrade:"Upgrade",

      // Landing
      heroKicker:"MEMOIR APP",
      heroA:"Preserve Your", heroB:"Memories Forever",
      heroBlurb:"Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      ctaStart:"Start Recording", ctaStories:"My Stories",

      whyTitle:"Why Memoir",
      why1T:"Capture in one tap",
      why1D:"Pick a gentle prompt or speak freely. We’ll keep things simple and warm.",
      why2T:"Prepared for a book",
      why2D:"Whisper-based transcription with optional AI rewrites that read like a memoir.",
      why3T:"Private by default, share when you wish",
      why3D:"Your stories sync across devices in your private library. Invite your family to listen.",

      pricingTitle:"Pricing",
      planFreeT:"Free", planFreeD:"Up to 10 stories, max 2 minutes of transcription each.",
      planPremiumT:"Premium – €4.99/month",
      planPremiumD:"Up to 2.5 hours / month of AI transcription + rewrite.",
      planFamilyT:"Family – €7.99/month",
      planFamilyD:"Premium features + share your library with up to 4 read-only family members.",
      planExclusiveT:"Exclusive – €11.99/month",
      planExclusiveD:"Up to 5 hours / month of AI transcription + rewrite + family sharing.",
      upgrade:"Upgrade",

      // Stories page
      storiesTitle:"My Stories",
      storiesBlurb:"Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      statStories:"Stories",
      statFamily:"Family Members",
      inviteLabel:"Invite Family Member",
      invitePlaceholder:"name@example.com",
      inviteBtn:"Invite",
      listEmpty:"No stories yet — start your first one!",

      // Common small items
      month:"month"
    },

    fr: {
      navHome:"Accueil", navLogin:"Se connecter", navRecord:"Enregistrer", navStories:"Mes histoires",
      langEnglish:"English", langFrench:"Français", langDutch:"Nederlands", langSpanish:"Español",

      footerFaqTitle:"FAQ",
      footerQ1:"Y a-t-il une offre gratuite ?",
      footerA1:"Oui, vous pouvez essayer gratuitement avant de passer à l’abonnement.",
      footerQ2:"Quelles langues sont prises en charge ?",
      footerA2:"Anglais, Français, Néerlandais, Espagnol (d’autres arrivent).",
      footerQ3:"Comment se fait la transcription ?",
      footerA3:"Whisper côté serveur pour une grande précision ; fonctionne hors ligne puis se synchronise.",
      footerPricingTitle:"Tarifs",
      footerAboutTitle:"À propos",
      footerAboutCopy:"Memoir aide les familles à capturer leurs récits avec une belle prise de voix, une transcription IA et une bibliothèque privée.",
      footerUpgrade:"Passer à l’offre supérieure",

      heroKicker:"MEMOIR APP",
      heroA:"Préservez vos", heroB:"souvenirs pour toujours",
      heroBlurb:"Enregistrez une fois pour des générations. Lancez l’enregistrement d’un geste, ajoutez un titre et « quand c’est arrivé », puis partagez en toute sécurité avec votre famille.",
      ctaStart:"Commencer", ctaStories:"Mes histoires",

      whyTitle:"Pourquoi Memoir",
      why1T:"Capture en un geste",
      why1D:"Choisissez un petit thème ou parlez librement. Simple et chaleureux.",
      why2T:"Prêt pour un livre",
      why2D:"Transcription Whisper avec réécriture IA pour un style mémorial.",
      why3T:"Privé par défaut, partage libre",
      why3D:"Vos histoires se synchronisent sur vos appareils dans votre bibliothèque privée. Invitez votre famille à écouter.",

      pricingTitle:"Tarifs",
      planFreeT:"Gratuit", planFreeD:"Jusqu’à 10 histoires, 2 minutes de transcription chacune.",
      planPremiumT:"Premium – 4,99 €/mois",
      planPremiumD:"Jusqu’à 2,5 h / mois de transcription + réécriture IA.",
      planFamilyT:"Famille – 7,99 €/mois",
      planFamilyD:"Premium + partage avec 4 membres en lecture seule.",
      planExclusiveT:"Exclusive – 11,99 €/mois",
      planExclusiveD:"Jusqu’à 5 h / mois de transcription + réécriture IA + partage familial.",
      upgrade:"Mettre à niveau",

      storiesTitle:"Mes histoires",
      storiesBlurb:"Enregistrez une fois pour des générations…",
      statStories:"Histoires",
      statFamily:"Membres de la famille",
      inviteLabel:"Inviter un membre de la famille",
      invitePlaceholder:"nom@exemple.com",
      inviteBtn:"Inviter",
      listEmpty:"Aucune histoire — commencez votre première !",

      month:"mois"
    },

    nl: {
      navHome:"Home", navLogin:"Inloggen", navRecord:"Opnemen", navStories:"Mijn verhalen",
      langEnglish:"English", langFrench:"Français", langDutch:"Nederlands", langSpanish:"Español",

      footerFaqTitle:"FAQ",
      footerQ1:"Is er een gratis plan?",
      footerA1:"Ja, je kunt gratis proberen voordat je overstapt.",
      footerQ2:"Welke talen worden ondersteund?",
      footerA2:"Engels, Frans, Nederlands, Spaans (meer volgt).",
      footerQ3:"Hoe wordt er getranscribeerd?",
      footerA3:"Whisper op de server voor hoge nauwkeurigheid; werkt offline en synchroniseert later.",
      footerPricingTitle:"Prijzen",
      footerAboutTitle:"Over",
      footerAboutCopy:"Memoir helpt families levensverhalen vast te leggen met mooie spraakopname, AI-transcriptie en een privébibliotheek.",
      footerUpgrade:"Upgraden",

      heroKicker:"MEMOIR APP",
      heroA:"Bewaar je", heroB:"herinneringen voor altijd",
      heroBlurb:"Neem één keer op voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe en deel veilig met je familie.",
      ctaStart:"Opnemen", ctaStories:"Mijn verhalen",

      whyTitle:"Waarom Memoir",
      why1T:"Vastleggen met één tik",
      why1D:"Kies een zachte prompt of spreek vrijuit.",
      why2T:"Klaar voor een boek",
      why2D:"Whisper-transcriptie met optionele AI-herwerking.",
      why3T:"Standaard privé, deel wanneer je wilt",
      why3D:"Je verhalen synchroniseren over al je apparaten. Nodig familie uit om te luisteren.",

      pricingTitle:"Prijzen",
      planFreeT:"Gratis", planFreeD:"Tot 10 verhalen, max. 2 minuten transcriptie per verhaal.",
      planPremiumT:"Premium – €4,99/maand",
      planPremiumD:"Tot 2,5 uur / maand AI-transcriptie + herschrijven.",
      planFamilyT:"Family – €7,99/maand",
      planFamilyD:"Premium + bibliotheek delen met max. 4 familieleden (alleen lezen).",
      planExclusiveT:"Exclusive – €11,99/maand",
      planExclusiveD:"Tot 5 uur / maand AI-transcriptie + herschrijven + familiedeling.",
      upgrade:"Upgraden",

      storiesTitle:"Mijn verhalen",
      storiesBlurb:"Neem één keer op voor generaties…",
      statStories:"Verhalen",
      statFamily:"Familieleden",
      inviteLabel:"Familielid uitnodigen",
      invitePlaceholder:"naam@voorbeeld.com",
      inviteBtn:"Uitnodigen",
      listEmpty:"Nog geen verhalen — begin aan je eerste!",

      month:"maand"
    },

    es: {
      navHome:"Inicio", navLogin:"Entrar", navRecord:"Grabar", navStories:"Mis historias",
      langEnglish:"English", langFrench:"Français", langDutch:"Nederlands", langSpanish:"Español",

      footerFaqTitle:"Preguntas frecuentes",
      footerQ1:"¿Hay un plan gratuito?",
      footerA1:"Sí, puedes probar gratis antes de suscribirte.",
      footerQ2:"¿Qué idiomas se admiten?",
      footerA2:"Inglés, Francés, Neerlandés, Español (pronto habrá más).",
      footerQ3:"¿Cómo se hace la transcripción?",
      footerA3:"Whisper en el servidor para alta precisión; funciona sin conexión y se sincroniza después.",
      footerPricingTitle:"Precios",
      footerAboutTitle:"Acerca de",
      footerAboutCopy:"Memoir ayuda a las familias a capturar historias de vida con una hermosa voz, transcripción con IA y una biblioteca privada.",
      footerUpgrade:"Mejorar plan",

      heroKicker:"MEMOIR APP",
      heroA:"Preserve Your", heroB:"Memories Forever", /* Keep brand title style to force two lines the same way */
      heroBlurb:"Graba una vez y guárdalo para generaciones. Empieza con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura con tu familia.",
      ctaStart:"Empezar a grabar", ctaStories:"Mis historias",

      whyTitle:"Por qué Memoir",
      why1T:"Captura con un toque",
      why1D:"Elige un tema suave o habla libremente. Sencillo y cercano.",
      why2T:"Listo para un libro",
      why2D:"Transcripción con Whisper y reescritura opcional con estilo de memorias.",
      why3T:"Privado por defecto, comparte cuando quieras",
      why3D:"Tus historias se sincronizan en tus dispositivos. Invita a tu familia a escuchar.",

      pricingTitle:"Precios",
      planFreeT:"Gratis", planFreeD:"Hasta 10 historias, 2 minutos de transcripción por historia.",
      planPremiumT:"Premium – 4,99 €/mes",
      planPremiumD:"Hasta 2,5 h/mes de transcripción + reescritura con IA.",
      planFamilyT:"Familiar – 7,99 €/mes",
      planFamilyD:"Premium + compartir tu biblioteca con hasta 4 familiares (solo lectura).",
      planExclusiveT:"Exclusivo – 11,99 €/mes",
      planExclusiveD:"Hasta 5 h/mes de transcripción + reescritura + uso familiar.",
      upgrade:"Mejorar plan",

      storiesTitle:"Mis historias",
      storiesBlurb:"Graba una vez para generaciones…",
      statStories:"Historias",
      statFamily:"Miembros de la familia",
      inviteLabel:"Invitar a familiar",
      invitePlaceholder:"nombre@ejemplo.com",
      inviteBtn:"Invitar",
      listEmpty:"Aún no hay historias — ¡empieza la primera!",

      month:"mes"
    }
  };

  // Attach globally
  window.MEMOIR_I18N = {
    strings: STR,
    getLang,
    setLang,
    t(code, key){ return (STR[code] && STR[code][key]) || STR.en[key] || key; }
  };

  // Apply translations to any element with data-i18n / data-i18n-placeholder
  function applyTranslations(code){
    const root = document;
    root.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const txt = MEMOIR_I18N.t(code, key);
      // allow minimal HTML (for bold/line breaks in pricing)
      el.innerHTML = txt;
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      const txt = MEMOIR_I18N.t(code, key);
      el.setAttribute('placeholder', txt);
    });
    // let pages do their own extra hooks
    window.dispatchEvent(new CustomEvent('memoir:lang-applied', { detail:{code} }));
  }

  // Initial + whenever header changes it
  document.addEventListener('DOMContentLoaded', ()=>{
    applyTranslations(getLang());
  });
  window.addEventListener('memoir:lang', e=>{
    const code = e.detail?.code || getLang();
    setLang(code);
    applyTranslations(code);
  });

  // If partials load later, run one more time
  window.addEventListener('memoir:partials-loaded', ()=>{
    applyTranslations(getLang());
  });
})();
</script>
