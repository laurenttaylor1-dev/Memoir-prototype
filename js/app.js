/* =========================================================================
   Memoir App — Shared front-end runtime
   - i18n + language persistence
   - Header language drop-down bindings (open/close, outside click)
   - Guided prompts (Record page) auto-render
   - Optional Supabase hooks (plan badge, counts)
   - Smooth anchor scrolling with sticky header offset
   ======================================================================= */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const I18N = {
  en:{brand:"MEMOIR APP",tagline:"Preserve your memories forever",
      "nav.home":"Home","nav.login":"Sign in","nav.record":"Record","nav.stories":"My Stories","nav.pricing":"Pricing","nav.faq":"FAQ",
      "hero.title":"Preserve Your Memories Forever","hero.lede":"Record once, keep for generations. Start a recording in one tap, add a title and “when it happened”, then share safely with your family.",
      "cta.startRecording":"Start Recording","cta.myStories":"My Stories",
      "feat.1.title":"Smart Transcription","feat.1.text":"Server-side Whisper for accurate EN/FR/NL/ES.",
      "feat.2.title":"Guided or Free","feat.2.text":"Use gentle prompts or speak freely. Add a date or period like “early 1970s”.",
      "feat.3.title":"Private Library","feat.3.text":"Stories and media saved in your private account. Export when you’re ready.",
      "pricing.free.title":"Free","pricing.free.text":"Always free: record and save your memories, up to 2 minutes per story.",
      "pricing.premium.title":"Premium — €4.99/month","pricing.premium.text":"15-minute stories, AI rewrites, export to PDF/Canva, and cloud sync.",
      "pricing.family.title":"Family — €7.99/month","pricing.family.text":"All Premium features, plus sharing with up to 4 family members (read/listen only).",
      "faq.title":"FAQ",
      "faq.q1":"How do I record a story?","faq.a1":"Go to Record, tap the round button, and start speaking. Your words are transcribed automatically.",
      "faq.q2":"What is AI rewrite?","faq.a2":"Premium users can enhance their stories with smoother language, while keeping their authentic voice.",
      "faq.q3":"How do I share with family?","faq.a3":"On the My Stories page, you can invite family members by email (Family plan required).",
      "faq.q4":"How do subscriptions work?","faq.a4":"Subscriptions are managed via Stripe. You can cancel anytime in your account.",
      "record.title":"Record","record.prompts":"Today's suggested prompts","record.prompts.refresh":"Suggest other prompts","record.notes":"Notes (optional)","record.storyTitle":"Title","record.when":"When did this happen?","record.addPhoto":"Add photo (optional)","record.save":"Save story",
      "stories.title":"My Stories","stories.count":"Stories","stories.shared":"Shared with family"},
  fr:{brand:"MEMOIR APP",tagline:"Préservez vos souvenirs pour toujours",
      "nav.home":"Accueil","nav.login":"Connexion","nav.record":"Enregistrer","nav.stories":"Mes histoires","nav.pricing":"Tarifs","nav.faq":"FAQ",
      "hero.title":"Préservez vos souvenirs pour toujours","hero.lede":"Enregistrez une fois, gardez pour des générations. Lancez l’enregistrement en un geste, ajoutez un titre et « quand c’est arrivé », puis partagez en toute sécurité avec votre famille.",
      "cta.startRecording":"Commencer l’enregistrement","cta.myStories":"Mes histoires",
      "feat.1.title":"Transcription intelligente","feat.1.text":"Whisper côté serveur en EN/FR/NL/ES.",
      "feat.2.title":"Guidé ou Libre","feat.2.text":"Utilisez des invites douces ou parlez librement. Ajoutez une date ou période comme « début des années 1970 ».",
      "feat.3.title":"Bibliothèque privée","feat.3.text":"Histoires et médias enregistrés dans votre compte privé. Export quand vous voulez.",
      "pricing.free.title":"Gratuit","pricing.free.text":"Toujours gratuit : enregistrez et sauvegardez, jusqu’à 2 minutes par histoire.",
      "pricing.premium.title":"Premium — 4,99 €/mois","pricing.premium.text":"Histoires de 15 minutes, réécriture IA, export PDF/Canva et synchronisation cloud.",
      "pricing.family.title":"Famille — 7,99 €/mois","pricing.family.text":"Toutes les fonctions Premium, plus partage avec 4 proches (lecture/écoute).",
      "faq.title":"FAQ",
      "faq.q1":"Comment enregistrer une histoire ?","faq.a1":"Allez sur Enregistrer, appuyez sur le bouton rond et parlez. Vos mots sont transcrits automatiquement.",
      "faq.q2":"Qu’est-ce que la réécriture IA ?","faq.a2":"Les abonnés Premium améliorent la fluidité tout en gardant leur voix authentique.",
      "faq.q3":"Comment partager avec la famille ?","faq.a3":"Dans Mes histoires, invitez des proches par e-mail (offre Famille requise).",
      "faq.q4":"Comment fonctionnent les abonnements ?","faq.a4":"Les abonnements sont gérés via Stripe. Résiliable à tout moment.",
      "record.title":"Enregistrer","record.prompts":"Invites suggérées du jour","record.prompts.refresh":"Suggérer d’autres invites","record.notes":"Notes (optionnel)","record.storyTitle":"Titre","record.when":"Quand cela s’est-il passé ?","record.addPhoto":"Ajouter une photo (optionnel)","record.save":"Enregistrer l’histoire",
      "stories.title":"Mes histoires","stories.count":"Histoires","stories.shared":"Partagées avec la famille"},
  nl:{brand:"MEMOIR APP",tagline:"Bewaar je herinneringen voor altijd",
      "nav.home":"Home","nav.login":"Inloggen","nav.record":"Opnemen","nav.stories":"Mijn verhalen","nav.pricing":"Prijzen","nav.faq":"FAQ",
      "hero.title":"Bewaar je herinneringen voor altijd","hero.lede":"Neem één keer op, bewaar voor generaties. Start met één tik, voeg titel en ‘wanneer het gebeurde’ toe, en deel veilig met familie.",
      "cta.startRecording":"Start opnemen","cta.myStories":"Mijn verhalen",
      "feat.1.title":"Slimme transcriptie","feat.1.text":"Whisper op de server voor EN/FR/NL/ES.",
      "feat.2.title":"Geleid of Vrij","feat.2.text":"Gebruik zachte suggesties of spreek vrijuit. Voeg een datum of periode toe zoals ‘begin jaren 70’.",
      "feat.3.title":"Privé bibliotheek","feat.3.text":"Verhalen en media veilig opgeslagen. Exporteer wanneer je wilt.",
      "pricing.free.title":"Gratis","pricing.free.text":"Altijd gratis: opnemen en bewaren, tot 2 minuten per verhaal.",
      "pricing.premium.title":"Premium — €4,99/maand","pricing.premium.text":"15-minuten verhalen, AI-herwerking, export naar PDF/Canva en cloud sync.",
      "pricing.family.title":"Familie — €7,99/maand","pricing.family.text":"Alles van Premium + delen met 4 familieleden (alleen lezen/luisteren).",
      "faq.title":"FAQ",
      "faq.q1":"Hoe neem ik een verhaal op?","faq.a1":"Ga naar Opnemen, tik op de ronde knop en begin te spreken. We transcriberen automatisch.",
      "faq.q2":"Wat is AI-herwerking?","faq.a2":"Premium verbetert de stijl/vloeiendheid met behoud van je eigen stem.",
      "faq.q3":"Hoe deel ik met familie?","faq.a3":"Op Mijn verhalen kun je familieleden per e-mail uitnodigen (Familie-plan vereist).",
      "faq.q4":"Hoe werken abonnementen?","faq.a4":"Abonnementen via Stripe. Opzeggen kan altijd.",
      "record.title":"Opnemen","record.prompts":"Suggesties van vandaag","record.prompts.refresh":"Andere suggesties","record.notes":"Notities (optioneel)","record.storyTitle":"Titel","record.when":"Wanneer is dit gebeurd?","record.addPhoto":"Foto toevoegen (optioneel)","record.save":"Verhaal opslaan",
      "stories.title":"Mijn verhalen","stories.count":"Verhalen","stories.shared":"Gedeeld met familie"},
  es:{brand:"MEMOIR APP",tagline:"Conserva tus recuerdos para siempre",
      "nav.home":"Inicio","nav.login":"Acceder","nav.record":"Grabar","nav.stories":"Mis historias","nav.pricing":"Precios","nav.faq":"FAQ",
      "hero.title":"Conserva tus recuerdos para siempre","hero.lede":"Graba una vez, guarda para generaciones. Empieza con un toque, añade título y ‘cuándo ocurrió’, y comparte de forma segura con tu familia.",
      "cta.startRecording":"Empezar a grabar","cta.myStories":"Mis historias",
      "feat.1.title":"Transcripción inteligente","feat.1.text":"Whisper del lado del servidor para EN/FR/NL/ES.",
      "feat.2.title":"Guiado o Libre","feat.2.text":"Usa sugerencias suaves o habla libremente. Añade una fecha o periodo como ‘principios de los 70’.",
      "feat.3.title":"Biblioteca privada","feat.3.text":"Historias y medios guardados en tu cuenta privada. Exporta cuando quieras.",
      "pricing.free.title":"Gratis","pricing.free.text":"Siempre gratis: graba y guarda, hasta 2 minutos por historia.",
      "pricing.premium.title":"Premium — 4,99 €/mes","pricing.premium.text":"Historias de 15 minutos, reescritura con IA, exportación PDF/Canva y sincronización en la nube.",
      "pricing.family.title":"Familiar — 7,99 €/mes","pricing.family.text":"Todo Premium + compartir con 4 familiares (solo lectura/escucha).",
      "faq.title":"FAQ",
      "faq.q1":"¿Cómo grabo una historia?","faq.a1":"Ve a Grabar, toca el botón redondo y empieza a hablar. Transcribimos automáticamente.",
      "faq.q2":"¿Qué es la reescritura con IA?","faq.a2":"Premium mejora el estilo/fluidez manteniendo tu voz auténtica.",
      "faq.q3":"¿Cómo comparto con mi familia?","faq.a3":"En Mis historias puedes invitar por correo (plan Familiar requerido).",
      "faq.q4":"¿Cómo funcionan las suscripciones?","faq.a4":"Suscripciones con Stripe. Puedes cancelar cuando quieras.",
      "record.title":"Grabar","record.prompts":"Sugerencias de hoy","record.prompts.refresh":"Otras sugerencias","record.notes":"Notas (opcional)","record.storyTitle":"Título","record.when":"¿Cuándo sucedió?","record.addPhoto":"Añadir foto (opcional)","record.save":"Guardar historia",
      "stories.title":"Mis historias","stories.count":"Historias","stories.shared":"Compartidas con la familia"}
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
  const btn  = $('[data-lang-button]');
  const menu = $('[data-lang-menu]');
  if (!btn || !menu) return;

  const open  = () => menu.classList.add('show');
  const close = () => menu.classList.remove('show');

  btn.addEventListener('click', (e)=>{ e.preventDefault(); menu.classList.toggle('show'); });
  document.addEventListener('click', (e)=>{
    if (!menu.contains(e.target) && !btn.contains(e.target)) close();
  });
  $$('[data-lang]', menu).forEach(b=>{
    b.addEventListener('click', ()=>{
      const code = b.dataset.lang;
      window.applyTranslations(code);
      close();
    });
  });
};

/* Smooth anchor scrolling with sticky header offset */
(function(){
  const HEADER_OFFSET = 90; // approx header + subline
  function scrollToHash(hash){
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  if (location.hash) setTimeout(()=>scrollToHash(location.hash), 0);
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"], a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname === location.pathname && url.hash) {
      e.preventDefault();
      history.pushState(null, '', url.hash);
      scrollToHash(url.hash);
    }
  });
})();

/* Guided topics */
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
        const b=document.createElement('button');
        b.className='mk-chip'; b.type='button'; b.textContent=w;
        b.onclick=()=>{ const t=$('#storyTitle'); if (t) t.value=w; };
        container.appendChild(b);
      });
    };
  }
}

/* Optional Supabase hooks */
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
  }catch(e){ el.textContent=''; }
}
async function updateStoryCountIfPresent(){
  const el = $('#storyCount'); if (!el || !sb) return;
  try{
    const { count, error } = await sb.from('stories').select('*', { count:'exact', head:true });
    if (error) throw error;
    el.textContent = String(count ?? 0);
  }catch(e){}
}

document.addEventListener('DOMContentLoaded', ()=>{
  if ($('[data-lang-button]')) window.initHeaderBindings();
  const lang = localStorage.getItem('memoir.lang') || 'en';
  window.applyTranslations(lang);
  if ($('#guidedChips')) renderGuidedChips($('#guidedChips'), lang);
  updatePlanBadgeIfPresent();
  updateStoryCountIfPresent();
});
