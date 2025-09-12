window.MEMOIR_I18N = (function(){
  const strings = {
    en: {
      // ==== Global
      footerAbout: "Memoir helps families capture life stories with beautiful voice capture, AI transcription, and polished AI rewrites.",
      footerLegal: "Legal & Policies",

      // ==== Hero
      brandKicker: "MEMOIR APP",
      heroTitleA: "Preserve Your",
      heroTitleB: "Memories Forever",
      heroBlurb: "Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",

      // ==== Mini cards
      miniStartLabel: "Start Recording",
      miniStartCopy: "One tap to begin. Add a title and “when it happened” later.",
      startRecording: "Start Recording",
      miniStoriesLabel: "View My Stories",
      miniStoriesCopy: "Browse, rewrite with AI, export, and share with your family.",
      viewStories: "My Stories",

      // ==== Why Memoir
      whyTitle: "Why Memoir",
      feat1Title: "Accurate transcription",
      feat1Copy: "Capture every word with Whisper-powered transcription for high accuracy and clarity.",
      feat2Title: "AI rewrite for families",
      feat2Copy: "Turn your spoken words into polished, engaging stories — like real literature your family will love to read.",
      feat3Title: "Private or shared",
      feat3Copy: "Keep stories private or share read-only with selected family members; everything syncs across your devices.",

      // ==== Pricing
      pricingTitle: "Pricing",
      tierFreeName: "Free",     tierFreePrice: "€0",
      tierFreeB1: "Up to 10 stories",
      tierFreeB2: "Max 2 minutes transcription per story",
      tierFreeB3: "Private library on all your devices",

      tierPremiumName: "Storyteller — €6.99/month",  tierPremiumPrice: "€6.99 / mo",
      tierPremiumB1: "Up to 2.5 hours / month of AI transcription",
      tierPremiumB2: "AI Rewrite (polish stories), export to PDF/CSV",
      tierPremiumB3: "Priority processing",

      tierFamilyName: "Family — €8.99/month",        tierFamilyPrice: "€8.99 / mo",
      tierFamilyB1: "Everything in Storyteller",
      tierFamilyB2: "Share your library with up to 4 read-only family members",
      tierFamilyB3: "Invite by email; revoke anytime",

      tierExclusiveName: "Exclusive — €11.99/month", tierExclusivePrice: "€11.99 / mo",
      tierExclusiveB1: "Up to 5 hours / month of AI transcription + rewrite",
      tierExclusiveB2: "Family sharing (up to 4)",
      tierExclusiveB3: "Best for active storytellers",

      // ==== Record
      recordTitle: "Record",
      recordButton: "Record",
      stop: "Stop",
      recordingHint: "Recording… transcription will appear live when online.",
      listening: "Listening…",
      offlineHint: "Offline — audio saved and will sync later.",
      recordFree: "Free",
      recordGuided: "Guided",
      guidedLead: "Pick a topic to spark your memory:",
      notesLabel: "Notes (optional)",
      notesPlaceholder: "Add a quick note…",
      titleLabel: "Title",
      titlePlaceholder: "Story title",
      whenLabel: "When did this happen?",
      whenPlaceholder: "e.g. “summer 1945”, “early 2018”, “15 Feb 1972”",
      photoLabel: "Add photo (optional)",
      transcriptLabel: "Transcript",
      transcriptEmpty: "Your words will appear here…",
      saveStory: "Save story",
      rewriteHint: "Tip: after saving, use AI Rewrite in “My Stories” to turn this into a polished, book-ready story.",
      storyDefault: "Story",
      noTranscript: "There is no transcript yet. Say a few words, then try again.",
      saved: "Saved! You can find it in My Stories.",
      saveFailed: "Save failed. If you are offline, it will retry when connected.",

      // ==== Stories
      storiesTitle: "My Stories",
      storiesEmpty: "No stories yet. Record your first one!",
      storiesListEmpty: "List is empty.",
      storiesRewrite: "Rewrite with AI",
      storiesExport: "Export",
      storiesDelete: "Delete"
    },

    // ==== French stub
    fr: {
      footerAbout: "Memoir aide les familles à capturer leurs histoires de vie avec une belle capture vocale, une transcription IA et des réécritures soignées.",
      footerLegal: "Mentions légales & Politiques",
      // … replicate keys as above with FR translations
    },

    // ==== Spanish stub
    es: {
      footerAbout: "Memoir ayuda a las familias a capturar historias de vida con una hermosa captura de voz, transcripción por IA y reescrituras pulidas.",
      footerLegal: "Aviso legal y políticas",
      // … replicate keys as above with ES translations
    },

    // ==== Dutch stub
    nl: {
      footerAbout: "Memoir helpt families levensverhalen vast te leggen met mooie stemopnames, AI-transcriptie en verzorgde herschrijvingen.",
      footerLegal: "Juridische info & beleid",
      // … replicate keys as above with NL translations
    }
  };

  let current = localStorage.getItem('memoirLang') || 'en';

  function apply(code){
    current = code;
    localStorage.setItem('memoirLang', code);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const str = strings[code]?.[key] || strings.en[key] || '';
      if(str) el.textContent = str;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      const str = strings[code]?.[key] || strings.en[key] || '';
      if(str) el.placeholder = str;
    });
    window.dispatchEvent(new CustomEvent('memoir:lang',{detail:{code}}));
  }

  return {
    strings,
    getLang: ()=>current,
    setLang: apply,
    t: key=> strings[current]?.[key] || strings.en[key]
  };
})();
