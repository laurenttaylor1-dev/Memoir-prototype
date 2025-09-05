<script>
// ====== CONFIG (Supabase + images) ======
const SUPABASE_URL = "https://jrjqciywlijhhcxfxywh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyanFjaXl3bGlqaGhjeGZ4eXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDQ2NzEsImV4cCI6MjA3MTA4MDY3MX0.5FeQxu_N7q-1Br00yJu4E-TKTZK4U4ZnJ4jpRo7Atak";

const HERO_IMAGES = [
  "/assets/book-1.jpg",
  "/assets/book-2.jpg",
  "/assets/book-3.jpg"
];

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:false}
});

// ====== Utilities ======
const $ = (sel, root=document)=>root.querySelector(sel);
const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));

function setLangFromDropdown(){
  const ddl = $('#lang');
  if (!ddl) return;
  const val = ddl.value;
  localStorage.setItem('memoir.lang', val);
  // You can expand i18n here later
}

function hydrateNavAuth(){
  const loginLink = $('#nav-login');
  const userBadge = $('#userBadge');
  supabase.auth.getUser().then(({data:{user}})=>{
    if(user){
      if(loginLink) loginLink.classList.add('hidden');
      if(userBadge){ userBadge.textContent = user.email || "Account"; userBadge.classList.remove('hidden'); }
    }else{
      if(loginLink) loginLink.classList.remove('hidden');
      if(userBadge) userBadge.classList.add('hidden');
    }
  });
  $('#logoutBtn')?.addEventListener('click', async ()=>{
    await supabase.auth.signOut();
    location.href = "/login.html";
  });
}

function wireHeroRotation(){
  const img = $('#heroImg');
  if(!img) return;
  let i = 0;
  img.src = HERO_IMAGES[i%HERO_IMAGES.length];
  setInterval(()=>{
    i++;
    img.src = HERO_IMAGES[i%HERO_IMAGES.length];
  }, 30000); // 30s
}

function guardRecordAndStoriesLinks(){
  // Record and Stories require auth; redirect anonymous to login
  const needsAuth = $$('.needs-auth');
  needsAuth.forEach(el=>{
    el.addEventListener('click', async (e)=>{
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user){
        e.preventDefault();
        location.href = "/login.html";
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  hydrateNavAuth();
  wireHeroRotation();
  guardRecordAndStoriesLinks();

  const savedLang = localStorage.getItem('memoir.lang');
  if(savedLang && $('#lang')) $('#lang').value = savedLang;
  $('#lang')?.addEventListener('change', setLangFromDropdown);
});
</script>
