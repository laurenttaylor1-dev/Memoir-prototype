/* Global i18n + header dropdown wiring */
(function(){
  const LS_KEY = 'memoir_lang';

  const STR = {
    en: {
      brandTag: "Preserve your memories forever",
      nav: { home:"Home", login:"Login", record:"Record", stories:"My Stories", settings:"Settings" },
      langLabel: "English",

      // Landing hero
      heroA: "Preserve Your",
      heroB: "Memories Forever",
      heroBlurb: "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",

      actionStartTitle:"Start Recording",
      actionStartBody:"One tap to begin. Add a title and “when it happened” later.",
      actionStoriesTitle:"View My Stories",
      actionStoriesBody:"Browse, rewrite with AI, export, and share with your family.",

      // Features (a bit more elaborated)
      feat1T:"Capture in one tap",
      feat1B:"Pick a gentle prompt or speak freely — Memoir records your voice in high quality and keeps everything organized as a story.",
      feat2T:"Ready for a family book",
      feat2B:"Whisper-based transcription turns your words into clean text; you can fix little typos and add a time or season later.",
      feat3T:"Private by default",
      feat3B:"Your stories stay in your private library. Share read-only access with family when you’re ready — across all devices.",

      // Pricing board
      pricingTitle:"Pricing",
      planFreeT:"Free",            planFreePrice:"€0",
      planFreeList:[
        "Up to 10 stories",
        "Max 2 minutes of transcription each",
        "Private library on all your devices"
      ],
      planPremiumT:"Premium — €6.99/month", planPremiumPrice:"€6.99 / mo",
      planPremiumList:[
        "Up to 2.5 hours / month of AI transcription",
        "Smart rewrite, export to PDF/CSV",
        "Priority processing"
      ],
      planFamilyT:"Family — €8.99/month", planFamilyPrice:"€8.99 / mo",
      planFamilyList:[
        "Everything in Premium",
        "Share your library with up to 4 read-only family members",
        "Invite with email; revoke anytime"
      ],
      planExclusiveT:"Exclusive — €11.99/month", planExclusivePrice:"€10.99 / mo",
      planExclusiveList:[
        "Up to 5 hours / month of AI transcription + rewrite",
        "Family sharing (up to 4)",
        "Best for active storytellers"
      ],
      upgrade:"Upgrade",

      // Footer
      faqTitle:"FAQ",
      qFree:"Is there a free plan?",
      aFree:"Yes, you can try the app for free before upgrading.",
      qLangs:"Which languages are supported?",
      aLangs:"English, Français, Nederlands, Español (more coming).",
      qTrans:"How is transcription done?",
      aTrans:"Server-side Whisper for high accuracy; works offline then syncs later.",
      footPricingTitle:"Pricing",
      aboutTitle:"About",
      aboutBlurb:"Memoir helps families capture life stories with beautiful voice capture, AI transcription, and a private library.",

      // Record
      recTitle:"Record",
      freeMode:"Free",
      guidedMode:"Guided",
      todays:"Today's suggested prompts",
      other:"Other",
      notes:"Notes (optional)",
      titleLabel:"Title",
      whenLabel:"When did this happen?",
      photoLabel:"Add photo (optional)",
      transcriptLabel:"Transcript",
      transcriptHint:"Recording… transcription will appear live when online.",
      save:"Save story",
      myStories:"My Stories",

      // Stories page
      storiesTitle:"My Stories",
      statsStories:"Stories",
      statsMembers:"Family Members",
      invitePH:"Invite Family Member (email)"
    },

    fr: {
      brandTag: "Préservez vos souvenirs pour toujours",
      nav: { home:"Accueil", login:"Connexion", record:"Enregistrer", stories:"Mes histoires", settings:"Réglages" },
      langLabel: "Français",

      heroA:"Préservez Vos",
      heroB:"Souvenirs Pour Toujours",
      heroBlurb:"Enregistrez une fois, gardez pour des générations. Lancez un enregistrement en un geste, ajoutez un titre et quand ça s'est passé, puis partagez en toute sécurité avec votre famille.",

      actionStartTitle:"Démarrer l’enregistrement",
      actionStartBody:"Un geste pour commencer. Ajoutez le titre et quand ça s'est passé plus tard.",
      actionStoriesTitle:"Voir mes histoires",
      actionStoriesBody:"Parcourez, réécrivez avec l’IA, exportez et partagez avec votre famille.",

      feat1T:"Capture en un geste",
      feat1B:"Choisissez un petit sujet ou parlez librement — Memoir enregistre votre voix en haute qualité et organise tout en histoire.",
      feat2T:"Prêt pour un livre de famille",
      feat2B:"La transcription Whisper transforme vos mots en texte clair; vous pourrez corriger les petites fautes et ajouter une date plus tard.",
      feat3T:"Privé par défaut",
      feat3B:"Vos histoires restent dans votre bibliothèque privée. Partage en lecture seule quand vous voulez — sur tous vos appareils.",

      pricingTitle:"Tarifs",
      planFreeT:"Gratuit", planFreePrice:"0 €",
      planFreeList:[
        "Jusqu’à 10 histoires",
        "2 minutes de transcription par histoire",
        "Bibliothèque privée sur tous vos appareils"
      ],
      planPremiumT:"Premium — 6,99 €/mois", planPremiumPrice:"6,99 € / mois",
      planPremiumList:[
        "Jusqu’à 2,5 h / mois de transcription IA",
        "Réécriture intelligente, export PDF/CSV",
        "Traitement prioritaire"
      ],
      planFamilyT:"Famille — 8,99 €/mois", planFamilyPrice:"8,99 € / mois",
      planFamilyList:[
        "Tout le Premium",
        "Partage en lecture seule avec jusqu’à 4 proches",
        "Invitation par email; révocation à tout moment"
      ],
      planExclusiveT:"Exclusive — 11,99 €/mois", planExclusivePrice:"11,99 € / mois",
      planExclusiveList:[
        "Jusqu’à 5 h / mois de transcription IA + réécriture",
        "Partage familial (jusqu’à 4)",
        "Idéal pour grands raconteurs"
      ],
      upgrade:"Passer en Premium",

      faqTitle:"FAQ",
      qFree:"Y a-t-il une formule gratuite ?",
      aFree:"Oui, vous pouvez essayer gratuitement avant de passer à l’abonnement.",
      qLangs:"Quelles langues sont prises en charge ?",
      aLangs:"Anglais, Français, Néerlandais, Espagnol (d’autres arrivent).",
      qTrans:"Comment fonctionne la transcription ?",
      aTrans:"Whisper côté serveur pour une grande précision; fonctionne hors-ligne puis synchronise ensuite.",
      footPricingTitle:"Tarifs",
      aboutTitle:"À propos",
      aboutBlurb:"Memoir aide les familles à capturer leurs histoires de vie avec une belle prise de voix, une transcription IA et une bibliothèque privée.",

      recTitle:"Enregistrer",
      freeMode:"Libre",
      guidedMode:"Guidé",
      todays:"Sujets suggérés du jour",
      other:"Autre",
      notes:"Notes (optionnel)",
      titleLabel:"Titre",
      whenLabel:"Quand cela s’est-il passé ?",
      photoLabel:"Ajouter une photo (optionnel)",
      transcriptLabel:"Transcription",
      transcriptHint:"Enregistrement… la transcription apparaîtra en direct si vous êtes en ligne.",
      save:"Enregistrer l’histoire",
      myStories:"Mes histoires",

      storiesTitle:"Mes histoires",
      statsStories:"Histoires",
      statsMembers:"Membres de la famille",
      invitePH:"Inviter un membre (email)"
    },

    nl: {
      brandTag:"Bewaar je herinneringen voor altijd",
      nav:{home:"Home",login:"Inloggen",record:"Opnemen",stories:"Mijn verhalen",settings:"Instellingen"},
      langLabel:"Nederlands",

      heroA:"Bewaar Je",
      heroB:"Herinneringen Voor Altijd",
      heroBlurb:"Neem één keer op, bewaar voor generaties. Start met één klik, voeg een titel en wanneer het gebeurde toe en deel veilig met je familie.",

      actionStartTitle:"Opname starten",
      actionStartBody:"Eén klik om te beginnen. Voeg later een titel en wanneer het gebeurde toe.",
      actionStoriesTitle:"Mijn verhalen bekijken",
      actionStoriesBody:"Blader, herschrijf met AI, exporteer en deel met je familie.",

      feat1T:"Opnemen met één klik",
      feat1B:"Kies een onderwerp of spreek vrij — Memoir neemt je stem in hoge kwaliteit op en organiseert alles als verhaal.",
      feat2T:"Klaar voor een familieboek",
      feat2B:"Whisper-transcriptie maakt zuivere tekst en AI herschrijft je verhaal tot een echt boek.",
      feat3T:"Standaard privé",
      feat3B:"Je verhalen blijven in je privébibliotheek. Deel alleen-lezen toegang met familie — op al je apparaten.",

      pricingTitle:"Prijzen",
      planFreeT:"Gratis", planFreePrice:"€0",
      planFreeList:["Tot 10 verhalen","Max 2 minuten transcriptie per verhaal","Privébibliotheek op al je apparaten"],
      planPremiumT:"Premium — €6,99/maand", planPremiumPrice:"€6,99 / mnd",
      planPremiumList:["Tot 2,5 uur / maand AI-transcriptie","Slim herschrijven, export naar PDF/CSV","Prioriteit"],
      planFamilyT:"Family — €8,99/maand", planFamilyPrice:"€8,99 / mnd",
      planFamilyList:["Alles van Premium","Deel met tot 4 familieleden (alleen-lezen)","Uitnodigen per e-mail; intrekken kan altijd"],
      planExclusiveT:"Exclusive — €11,99/maand", planExclusivePrice:"€11,99 / mnd",
      planExclusiveList:["Tot 5 uur / maand AI + herschrijven","Gezinsdeling (tot 4)","Beste keuze voor actieve vertellers"],
      upgrade:"Upgraden",

      faqTitle:"Veelgestelde vragen",
      qFree:"Is er een gratis plan?",
      aFree:"Ja, je kunt gratis proberen voordat je een abonnement neemt.",
      qLangs:"Welke talen worden ondersteund?",
      aLangs:"Engels, Frans, Nederlands, Spaans (meer volgt).",
      qTrans:"Hoe werkt transcriptie?",
      aTrans:"Whisper op de server voor hoge nauwkeurigheid; werkt offline en synchroniseert later.",
      footPricingTitle:"Prijzen",
      aboutTitle:"Over",
      aboutBlurb:"Memoir helpt families levensverhalen vast te leggen met mooie stemopnames, AI-transcriptie en een privébibliotheek.",

      recTitle:"Opnemen",
      freeMode:"Vrij",
      guidedMode:"Geleid",
      todays:"Suggesties van vandaag",
      other:"Overig",
      notes:"Notities (optioneel)",
      titleLabel:"Titel",
      whenLabel:"Wanneer gebeurde dit?",
      photoLabel:"Foto toevoegen (optioneel)",
      transcriptLabel:"Transcript",
      transcriptHint:"Opnemen… transcript verschijnt live wanneer je online bent.",
      save:"Verhaal opslaan",
      myStories:"Mijn verhalen",

      storiesTitle:"Mijn verhalen",
      statsStories:"Verhalen",
      statsMembers:"Familieleden",
      invitePH:"Familielid uitnodigen (e-mail)"
    },

    es: {
      brandTag:"Conserva tus recuerdos para siempre",
      nav:{home:"Inicio",login:"Entrar",record:"Grabar",stories:"Mis historias",settings:"Ajustes"},
      langLabel:"Español",

      heroA:"Preserva Tus",
      heroB:"Recuerdos Para Siempre",
      heroBlurb:"Graba una vez y guárdalo por generaciones. Inicia una grabación con un toque, añade un título y “cuándo ocurrió”, y comparte de forma segura con tu familia.",

      actionStartTitle:"Empezar a grabar",
      actionStartBody:"Un toque para empezar. Añade el título y “cuándo ocurrió” más tarde.",
      actionStoriesTitle:"Ver mis historias",
      actionStoriesBody:"Explora, reescribe con IA, exporta y comparte con tu familia.",

      feat1T:"Captura con un toque",
      feat1B:"Elige un pequeño tema o habla libremente — Memoir graba tu voz con alta calidad y lo organiza como una historia.",
      feat2T:"Listo para un libro familiar",
      feat2B:"La transcripción con Whisper convierte tus palabras en texto limpio; podrás corregir detalles y añadir fecha más tarde.",
      feat3T:"Privado por defecto",
      feat3B:"Tus historias permanecen en tu biblioteca privada. Comparte sólo lectura con tu familia — en todos tus dispositivos.",

      pricingTitle:"Precios",
      planFreeT:"Gratis", planFreePrice:"0 €",
      planFreeList:["Hasta 10 historias","Máx 2 min de transcripción por historia","Biblioteca privada en todos tus dispositivos"],
      planPremiumT:"Premium — 6,99 €/mes", planPremiumPrice:"6,99 € / mes",
      planPremiumList:["Hasta 2,5 h / mes de transcripción IA","Reescritura inteligente, exportar a PDF/CSV","Procesamiento prioritario"],
      planFamilyT:"Familiar — 8,99 €/mes", planFamilyPrice:"8,99 € / mes",
      planFamilyList:["Todo lo de Premium","Comparte con hasta 4 familiares (sólo lectura)","Invita por email; revoca cuando quieras"],
      planExclusiveT:"Exclusive — 11,99 €/mes", planExclusivePrice:"11,99 € / mes",
      planExclusiveList:["Hasta 5 h / mes de IA + reescritura","Uso familiar (hasta 4)","Mejor para narradores activos"],
      upgrade:"Mejorar",

      faqTitle:"FAQ",
      qFree:"¿Hay un plan gratuito?",
      aFree:"Sí, puedes probar gratis antes de suscribirte.",
      qLangs:"¿Qué idiomas se admiten?",
      aLangs:"Inglés, Francés, Neerlandés, Español (más en camino).",
      qTrans:"¿Cómo se hace la transcripción?",
      aTrans:"Whisper en el servidor para alta precisión; funciona sin conexión y sincroniza después.",
      footPricingTitle:"Precios",
      aboutTitle:"Acerca de",
      aboutBlurb:"Memoir ayuda a las familias a capturar historias de vida con bella toma de voz, transcripción con IA y una biblioteca privada.",

      recTitle:"Grabar",
      freeMode:"Libre",
      guidedMode:"Guiado",
      todays:"Sugerencias de hoy",
      other:"Otro",
      notes:"Notas (opcional)",
      titleLabel:"Título",
      whenLabel:"¿Cuándo ocurrió?",
      photoLabel:"Añadir foto (opcional)",
      transcriptLabel:"Transcripción",
      transcriptHint:"Grabando… la transcripción aparecerá en vivo cuando haya conexión.",
      save:"Guardar historia",
      myStories:"Mis historias",

      storiesTitle:"Mis historias",
      statsStories:"Historias",
      statsMembers:"Miembros de familia",
      invitePH:"Invitar familiar (email)"
    }
  };

  function setLang(code){
    localStorage.setItem(LS_KEY, code);
    document.dispatchEvent(new CustomEvent('memoir:lang', { detail:{ code } }));
  }
  function getLang(){ return localStorage.getItem(LS_KEY) || 'en'; }

  // Expose
  window.MEMOIR_I18N = { strings:STR, setLang, getLang };

  // Header dropdown wiring
  document.addEventListener('DOMContentLoaded', ()=>{
    const code = getLang();
    applyHeader(code);

    const toggle = document.getElementById('lang-toggle');
    const menu = document.getElementById('lang-dropdown');
    toggle?.addEventListener('click', ()=>{
      menu.hidden = !menu.hidden;
      if(!menu.hidden) {
        const close = (e)=>{ if(!menu.contains(e.target) && e.target!==toggle){ menu.hidden=true; document.removeEventListener('click', close); } };
        setTimeout(()=>document.addEventListener('click', close),0);
      }
    });

    menu?.querySelectorAll('.lang-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        menu.hidden = true;
        setLang(btn.dataset.lang);
      });
    });
  });

  // Apply header & footer text + nav
  function applyHeader(code){
    const t = STR[code] || STR.en;
    const byId = id => document.getElementById(id);

    byId('hdrTag')?.textContent = t.brandTag;
    byId('navHome')?.textContent = t.nav.home;
    byId('navLogin')?.textContent = t.nav.login;
    byId('navRecord')?.textContent = t.nav.record;
    byId('navStories')?.textContent = t.nav.stories;
    byId('navSettings')?.textContent = t.nav.settings;
    byId('lang-current-label')?.textContent = t.langLabel;

    // Footer
    byId('faqTitle')?.textContent = t.faqTitle;
    byId('qFree')?.textContent = t.qFree;
    byId('aFree')?.textContent = t.aFree;
    byId('qLangs')?.textContent = t.qLangs;
    byId('aLangs')?.textContent = t.aLangs;
    byId('qTrans')?.textContent = t.qTrans;
    byId('aTrans')?.textContent = t.aTrans;
    byId('footPricingTitle')?.textContent = t.footPricingTitle;
    byId('btnUpgradeFooter')?.textContent = t.upgrade;
    byId('aboutTitle')?.textContent = t.aboutTitle;
    byId('aboutBlurb')?.textContent = t.aboutBlurb;
  }

  // Listen globally
  document.addEventListener('memoir:lang', e=>{
    const code = e.detail.code;
    applyHeader(code);
  });
})();
