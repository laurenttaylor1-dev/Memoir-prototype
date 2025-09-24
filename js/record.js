/* /js/record.js
 * Renders Free/Guided chips, handles "Suggest other prompts",
 * and speaks a gentle line for Guided topics via /api/voice.
 * Relies on window.MEMOIR_RECORD (record-core.js).
 */
(function () {
  const CORE = () => window.MEMOIR_RECORD; // lazily grab after DOMContentLoaded
  const I18N = window.MEMOIR_I18N || {};
  const getLang = () => (I18N.getLang && I18N.getLang()) || localStorage.getItem('memoir.lang') || 'en';
  const tr = (key, vars, fallback) =>
    (I18N.translate && I18N.translate(key, vars, getLang())) ||
    (I18N.t && I18N.t(key, getLang())) ||
    fallback || '';

  // Elements
  let promptsWrap, refreshBtn, tabFree, tabGuided, titleInput;

  // Free prompts (localized by lang.js via UI copy)
  const FREE_WORDS = {
    en:["Childhood","Family","School","Work","Love","War","Travel","Traditions","Holidays","Lessons","Advice","Turning-points"],
    fr:["Enfance","Famille","École","Travail","Amour","Guerre","Voyages","Traditions","Fêtes","Leçons","Conseils","Déclics"],
    es:["Infancia","Familia","Escuela","Trabajo","Amor","Guerra","Viajes","Tradiciones","Fiestas","Lecciones","Consejos","Momentos clave"],
    nl:["Jeugd","Familie","School","Werk","Liefde","Oorlog","Reizen","Tradities","Feestdagen","Lessen","Advies","Keerpunt"]
  };

  // Guided topics with a gentle TTS line (per lang, can be extended)
  const GUIDED = {
    en: [
      { title: "First Job", line: "Tell me about your very first job. How did you get it, and what did you learn?" },
      { title: "A Family Tradition", line: "Describe a family tradition that still warms your heart. Where did it come from?" },
      { title: "Best Friend", line: "Who was your best friend growing up? What made that friendship special?" },
      { title: "A Turning Point", line: "Think of a moment that changed your path. What happened, and how did you feel?" },
      { title: "A Place You Loved", line: "Describe a place you loved to visit. What did it look like, smell like, sound like?" }
    ],
    fr: [
      { title: "Premier emploi", line: "Parlez-moi de votre tout premier emploi. Comment l’avez-vous obtenu et qu’en avez-vous appris ?" },
      { title: "Tradition familiale", line: "Décrivez une tradition familiale qui vous tient à cœur. D’où vient-elle ?" },
      { title: "Meilleur ami", line: "Qui était votre meilleur ami enfant ? Qu’est-ce qui rendait ce lien si fort ?" },
      { title: "Déclic", line: "Pensez à un moment qui a changé votre chemin. Que s’est-il passé et qu’avez-vous ressenti ?" },
      { title: "Un lieu aimé", line: "Décrivez un lieu que vous aimiez visiter. À quoi ressemblait-il — odeurs, sons, couleurs ?" }
    ],
    es: [
      { title: "Primer trabajo", line: "Háblame de tu primer trabajo. ¿Cómo lo conseguiste y qué aprendiste?" },
      { title: "Tradición familiar", line: "Describe una tradición familiar que te conmueva. ¿De dónde viene?" },
      { title: "Mejor amigo", line: "¿Quién fue tu mejor amigo de infancia? ¿Qué hacía especial esa amistad?" },
      { title: "Un punto de giro", line: "Piensa en un momento que cambió tu camino. ¿Qué pasó y cómo te sentiste?" },
      { title: "Un lugar querido", line: "Describe un lugar que te encantaba visitar. ¿Cómo era, a qué olía, qué se oía?" }
    ],
    nl: [
      { title: "Eerste baan", line: "Vertel over je allereerste baan. Hoe kreeg je die, en wat heb je geleerd?" },
      { title: "Familietraditie", line: "Beschrijf een familietraditie die je dierbaar is. Waar komt die vandaan?" },
      { title: "Beste vriend", line: "Wie was je beste vriend als kind? Wat maakte die vriendschap bijzonder?" },
      { title: "Keerpunt", line: "Denk aan een moment dat je koers veranderde. Wat gebeurde er en hoe voelde dat?" },
      { title: "Een geliefde plek", line: "Beschrijf een plek die je graag bezocht. Hoe rook het er, wat hoorde je?" }
    ]
  };

  function randomize(arr, n) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  function renderFree() {
    const lang = getLang();
    const words = FREE_WORDS[lang] || FREE_WORDS.en;
    promptsWrap.innerHTML = '';
    randomize(words, 4).forEach((w) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = w;
      b.addEventListener('click', () => { if (titleInput) titleInput.value = w; });
      promptsWrap.appendChild(b);
    });
    refreshBtn.textContent = tr('recordPromptsRefresh', null, 'Suggest other prompts');
  }

  async function speak(text) {
    const resp = await fetch('/api/voice?text=' + encodeURIComponent(text));
    if (!resp.ok) throw new Error('TTS failed');
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    // play on user gesture (we call speak from a click)
    await audio.play().catch(()=>{});
  }

  function renderGuided() {
    const lang = getLang();
    const topics = GUIDED[lang] || GUIDED.en;
    promptsWrap.innerHTML = '';
    randomize(topics, 4).forEach(({ title, line }) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = title;
      b.addEventListener('click', async () => {
        if (titleInput) titleInput.value = title;
        try { await speak(line); } catch {}
      });
      promptsWrap.appendChild(b);
    });
    // Slight copy change for Guided
    refreshBtn.textContent = tr('recordPromptsRefresh', null, 'Suggest other prompts').replace(/prompts/i, 'topics');
  }

  function activateTab(which) {
    const FREE = which === 'free';
    tabFree.classList.toggle('active', FREE);
    tabGuided.classList.toggle('active', !FREE);
    if (FREE) renderFree();
    else renderGuided();
  }

  document.addEventListener('DOMContentLoaded', () => {
    promptsWrap = document.getElementById('prompts');
    refreshBtn  = document.getElementById('refreshPrompts');
    tabFree     = document.getElementById('tabFree');
    tabGuided   = document.getElementById('tabGuided');
    titleInput  = document.getElementById('title');

    // initial render
    activateTab('free');

    if (tabFree)   tabFree.addEventListener('click', () => activateTab('free'));
    if (tabGuided) tabGuided.addEventListener('click', () => activateTab('guided'));
    if (refreshBtn) refreshBtn.addEventListener('click', () => {
      if (tabGuided.classList.contains('active')) renderGuided();
      else renderFree();
    });

    // Re-render prompts on language change
    window.addEventListener('memoir:lang', () => {
      if (tabGuided.classList.contains('active')) renderGuided();
      else renderFree();
      CORE()?.refreshTranscriptPlaceholder();
      CORE()?.updateMicLabel();
    });
  });
})();
