<script>
// Tiny i18n + prompts. Default to English on first visit.
(function(){
  const DEFAULT = 'en';
  const FLAGS = { en:'🇬🇧', fr:'🇫🇷', nl:'🇧🇪', es:'🇪🇸' };

  const STRINGS = {
    en: {
      startRecording: 'Start Recording',
      viewStories: 'My Stories',
      todayPrompts: "Today's suggested prompts",
      refreshPrompts: 'Suggest other prompts',
      prompts: ['Childhood','Family','School','Work','Love','Travel','Traditions','Holidays','Lessons','Advice','Turning points'],
      heroTitleA: 'Preserve Your',
      heroTitleB: 'Memories Forever',
      heroBlurb: 'Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.'
    },
    fr: {
      startRecording: 'Commencer',
      viewStories: 'Mes histoires',
      todayPrompts: 'Suggestions du jour',
      refreshPrompts: 'Autres suggestions',
      prompts: ['Enfance','Famille','École','Travail','Amour','Voyages','Traditions','Fêtes','Leçons','Conseils','Déclics'],
      heroTitleA: 'Préservez Vos',
      heroTitleB: 'Souvenirs Pour Toujours',
      heroBlurb: 'Enregistrez une fois, gardez pour des générations…'
    },
    nl: {
      startRecording: 'Opnemen',
      viewStories: 'Mijn verhalen',
      todayPrompts: 'Suggesties van vandaag',
      refreshPrompts: 'Meer suggesties',
      prompts: ['Jeugd','Familie','School','Werk','Liefde','Reizen','Tradities','Feestdagen','Lessen','Advies','Keerpunt'],
      heroTitleA: 'Bewaar Je',
      heroTitleB: 'Herinneringen Voor Altijd',
      heroBlurb: 'Neem één keer op, bewaar voor generaties…'
    },
    es: {
      startRecording: 'Grabar',
      viewStories: 'Mis historias',
      todayPrompts: 'Sugerencias de hoy',
      refreshPrompts: 'Otras sugerencias',
      prompts: ['Infancia','Familia','Escuela','Trabajo','Amor','Viajes','Tradiciones','Fiestas','Lecciones','Consejos','Puntos clave'],
      heroTitleA: 'Conserva Tus',
      heroTitleB: 'Recuerdos Para Siempre',
      heroBlurb: 'Graba una vez, guarda para generaciones…'
    }
  };

  function getLang() {
    try {
      const saved = localStorage.getItem('memoir.lang');
      if (saved) return saved;
      localStorage.setItem('memoir.lang', DEFAULT);
      return DEFAULT;
    } catch {
      return DEFAULT;
    }
  }

  function setLang(code) {
    const c = STRINGS[code] ? code : DEFAULT;
    try { localStorage.setItem('memoir.lang', c); } catch {}
    window.dispatchEvent(new CustomEvent('memoir:lang', { detail:{ code:c }}));
  }

  // Update header label/flag if present
  function applyHeader(code){
    const flag = document.getElementById('langFlag');
    const label = document.getElementById('langLabel');
    if (flag)  flag.textContent  = FLAGS[code] || FLAGS.en;
    if (label) label.textContent = (
      {en:'English',fr:'Français',nl:'Nederlands',es:'Español'}[code] || 'English'
    );
  }

  // public API
  window.MEMOIR_I18N = {
    strings: STRINGS,
    flags: FLAGS,
    getLang,
    setLang,
    getPrompts(code, n=4){
      const pool = STRINGS[code || getLang()]?.prompts || STRINGS.en.prompts;
      // return random N
      const arr = [...pool].sort(()=>Math.random()-0.5).slice(0,n);
      return arr;
    }
  };

  // react to menu selection (from header-loader)
  window.addEventListener('memoir:set-lang', (e)=> setLang(e.detail.code));

  // first paint
  const initial = getLang();
  applyHeader(initial);
  // notify pages
  setTimeout(()=>window.dispatchEvent(new CustomEvent('memoir:lang', { detail:{ code: initial } })), 0);

  // keep header labels in sync
  window.addEventListener('memoir:lang', (e)=> applyHeader(e.detail.code));
})();
</script>
