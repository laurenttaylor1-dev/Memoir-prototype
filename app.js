/* =========================================================================
   Memoir App — Shared front-end runtime
   - i18n + language persistence
   - Header language drop-down bindings
   - Guided prompts (Record page) auto-render
   - Optional Supabase hooks (plan badge, counts) if keys are present
   ======================================================================= */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const I18N = {
  en:{brand:"MEMOIR APP",tagline:"Preserve your memories forever","nav.home":"Home","nav.login":"Login","nav.record":"Record","nav.stories":"My Stories","hero.title":"Preserve Your Memories Forever","hero.lede":"Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.","cta.startRecording":"Start Recording","cta.myStories":"My Stories","feat.1.title":"Smart Transcription","feat.1.text":"Server-side Whisper for accurate EN/FR/NL/ES.","feat.2.title":"Guided or Free","feat.2.text":"Use gentle prompts or speak freely. Add a date or period like “early 1970s”.","feat.3.title":"Private Library","feat.3.text":"Stories and media saved in your private account. Export when you’re ready.","record.title":"Record","record.prompts":"Today's suggested prompts","record.prompts.refresh":"Suggest other prompts","record.notes":"Notes (optional)","record.storyTitle":"Title","record.when":"When did this happen?","record.addPhoto":"Add photo (optional)","record.save":"Save story","stories.title":"My Stories","stories.count":"Stories","stories.shared":"Shared with family"},
  fr:{brand:"MEMOIR APP",tagline:"Préservez vos souvenirs pour toujours","nav.home":"Accueil","nav.login":"Connexion","nav.record":"Enregistrer","nav.stories":"Mes histoires","hero.title":"Préservez vos souvenirs pour toujours","hero.lede":"Enregistrez une fois, gardez pour des générations. Lancez l’enregistrement en un geste, ajoutez un titre et “quand c’est arrivé”, puis partagez en toute sécurité avec votre famille.","cta.startRecording":"Commencer l’enregistrement","cta.myStories":"Mes histoires","feat.1.title":"Transcription intelligente","feat.1.text":"Whisper côté serveur en EN/FR/NL/ES.","feat.2.title":"Guidé ou Libre","feat.2.text":"Utilisez des invites douces ou parlez librement. Ajoutez une date ou période comme « début des années 1970 ».","feat.3.title":"Bibliothèque privée","feat.3.text":"Histoires et médias enregistrés dans votre compte privé. Export quand vous voulez.","record.title":"Enregistrer","record.prompts":"Invites suggérées du jour","record.prompts.refresh":"Suggérer d’autres invites","record.notes":"Notes (optionnel)","record.storyTitle":"Titre","record.when":"Quand cela s’est-il passé ?","record.addPhoto":"Ajouter une photo (optionnel)","record.save":"Enregistrer l’histoire","stories.title":"Mes histoires","stories.count":"Histoires","stories.shared":"Partagées avec la famille"},
  nl:{brand:"MEMOIR APP",tagline:"Bewaar je herinneringen voor altijd","nav.home":"Home","nav.login":"Inloggen","nav.record":"Opnemen","nav.stories":"Mijn verhalen","hero.title":"Bewaar je herinneringen voor altijd","hero.lede":"Neem één keer op, bewaar voor generaties. Start met één tik, voeg een titel en “wanneer het gebeurde” toe, en deel veilig met je familie.","cta.startRecording":"Start opnemen","cta.myStories":"Mijn verhalen","feat.1.title":"Slimme transcriptie","feat.1.text":"Whisper op de server voor EN/FR/NL/ES.","feat.2.title":"Geleid of Vrij","feat.2.text":"Gebruik zachte suggesties of spreek vrijuit. Voeg een datum of periode toe zoals “begin jaren 70”.","feat.3.title":"Privé bibliotheek","feat.3.text":"Verhalen en media worden veilig opgeslagen. Exporteer wanneer je wilt.","record.title":"Opnemen","record.prompts":"Suggesties van vandaag","record.prompts.refresh":"Andere suggesties","record.notes":"Notities (optioneel)","record.storyTitle":"Titel","record.when":"Wanneer is dit gebeurd?","record.addPhoto":"Foto toevoegen (optioneel)","record.save":"Verhaal opslaan","stories.title":"Mijn verhalen","stories.count":"Verhalen","stories.shared":"Gedeeld met familie"},
  es:{brand:"MEMOIR APP",tagline:"Conserva tus recuerdos para siempre","nav.home":"Inicio","nav.login":"Acceder","nav.record":"Grabar","nav.stories":"Mis historias","hero.title":"Conserva tus recuerdos para siempre","hero.lede":"Graba una vez, guarda para generaciones. Empieza con un toque, añade título y “cuándo ocurrió”, y comparte de forma segura con tu familia.","cta.startRecording":"Empezar a grabar","cta.myStories":"Mis historias","feat.1.title":"Transcripción inteligente","feat.1.text":"Whisper del lado del servidor para EN/FR/NL/ES.","feat.2.title":"Guiado o Libre","feat.2.text":"Usa sugerencias suaves o habla libremente. Añade una fecha o periodo como “principios de los 70”.","feat.3.title":"Biblioteca privada","feat.3.text":"Historias y medios guardados en tu cuenta privada. Exporta cuando quieras.","record.title":"Grabar","record.prompts":"Sugerencias de hoy","record.prompts.refresh":"Otras sugerencias","record.notes":"Notas (opcional)","record.storyTitle":"Título","record.when":"¿Cuándo sucedió?","record.addPhoto":"Añadir foto (opcional)","record.save":"Guardar historia","stories.title":"Mis historias","stories.count":"Historias","stories.shared":"Compartidas con la familia"}
};

function langLabel(code){
  return {en:"🇬🇧 English",fr:"🇫🇷 Français",nl:"🇳🇱 Nederlands",es:"🇪🇸 Español"}[code] || "🇬🇧 English";
}

window.applyTranslations = function(lang){
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  localStorage.setItem('memoir.lang', lang);
  $$('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  $$('[data-i18n-html]').forEach(el=>{
    const key = el.getAttribute('data-i18n-html');
    if (dict[key]) el.innerHTML = dict[key];
  });
  const btn = $('[data-lang-button]');
  if (btn) btn.textContent = langLabel(lang);

  const chips = $('#guidedChips');
  if (chips) renderGuidedChips(chips, lang);
};

window.initHeaderBindings = function(){
  const btn = $('[data-lang-button]');
  const menu = $('[data-lang-menu]');
  if (!btn || !menu) return;

  const close = ()=>menu.classList.remove('show');
  btn.addEventListener('click', e=>{ e.preventDefault(); menu.classList.toggle('show'); });
  document.addEventListener('click', e=>{
    if (!menu.contains(e.target) && e.target !== btn) close();
  });
  $$('[data-lang]', menu).forEach(b=>{
    b.addEventListener('click', ()=>{
      const code = b.dataset.lang;
      window.applyTranslations(code);
      close();
    });
  });
};

const TOPICS = {
  en:["Childhood","Family","School","Work","Love","Travel","Traditions","Holidays","Lessons","Advice","Turning points","War"],
  fr:["Enfance","Famille","École","Travail","Amour","Voyages","Traditions","Fêtes","Leçons","Conseils","Déclics","Guerre"],
  nl:["Jeugd","Familie","School","Werk","Liefde","Reizen","Tradities","Feestdagen","Lessen","Advies","Keerpunt","Oorlog"],
  es:["Infancia","Familia","Escuela","Trabajo","Amor","Viajes","Tradiciones","Fiestas","Lecciones","Consejos","Puntos clave","Guerra"]
};

function renderGuidedChips(container, lang){
  const code = I18N[lang] ? lang : 'en';
  const words = TOPICS[code] || TOPICS.en;
  container.innerHTML = '';
  words.slice(0,4).forEach(w=>{
    const b = document.createElement('button');
    b.className = 'mk-chip';
    b.type = 'button';
    b.textContent = w;
    b.onclick = ()=>{ const t = $('#storyTitle'); if (t) t.value = w; };
    container.appendChild(b);
  });
  const refresh = $('#guidedRefresh');
  if (refresh){
    refresh.onclick = ()=>{
      const shuffled = [...words].sort(()=>Math.random()-0.5);
      container.innerHTML='';
      shuffled.slice(0,4).forEach(w=>{
        const b = document.createElement('button');
        b.className='mk-chip';
        b.type='button';
        b.textContent=w;
        b.onclick=()=>{ const t=$('#storyTitle'); if (t) t.value=w; };
        container.appendChild(b);
      });
    };
  }
}

/* Optional Supabase hooks (plan badge / story count) */
let sb=null;
(function maybeSupabase(){
  if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase){
    sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}
    });
  }
})();
async function updatePlanBadgeIfPresent(){
  const el = $('#planBadge'); if (!el || !sb) return;
  try{
    const { data:profile, error } = await sb.from('profiles').select('plan, role, trial_end').single();
    if (error) throw error;
    const isAdmin = profile?.role==='admin';
    const trialUntil = profile?.trial_end ? new Date(profile.trial_end) : null;
    const trialActive = trialUntil && Date.now()<trialUntil.getTime();
    let text='Free';
    if (isAdmin) text='Admin';
    else if (profile?.plan==='premium') text = trialActive ? 'Premium (trial)' : 'Premium';
    el.textContent = `Plan: ${text}`;
  }catch(e){ el.textContent=''; console.warn(e); }
}
async function updateStoryCountIfPresent(){
  const el = $('#storyCount'); if (!el || !sb) return;
  try{
    const { count, error } = await sb.from('stories').select('*', { count:'exact', head:true });
    if (error) throw error;
    el.textContent = String(count ?? 0);
  }catch(e){ console.warn(e); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  if ($('[data-lang-button]')) window.initHeaderBindings();
  const lang = localStorage.getItem('memoir.lang') || 'en';
  window.applyTranslations(lang);
  if ($('#guidedChips')) renderGuidedChips($('#guidedChips'), lang);
  updatePlanBadgeIfPresent();
  updateStoryCountIfPresent();
});
