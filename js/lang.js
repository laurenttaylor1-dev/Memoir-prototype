/* Memoir i18n core
 * - Stores selected language in localStorage ("memoir.lang")
 * - Provides getLang/setLang/t/applyAll
 * - Translates elements with:
 *     data-i18n="key"
 *     data-i18n-attr="placeholder:key|title:key|aria-label:key"
 * - Emits `memoir:lang` on change so pages can react (e.g., Record prompts).
 *
 * NOTE: If you already define MEMOIR_I18N.strings elsewhere, this file will
 * honor it. Otherwise it uses the minimal built-ins below.
 */
(function(){
  const STORE_KEY = 'memoir.lang';
  const DEFAULT_LANG = 'en';

  // Keep existing object if present
  const API = window.MEMOIR_I18N || (window.MEMOIR_I18N = {});

  // --- Minimal fallback strings (won't override your larger set) ---
  const fallbackStrings = {
    en: {
      headerTagline: 'Preserve your memories forever',
      navHome: 'Home', navLogin:'Login', navRecord:'Record', navStories:'My Stories',
      footerAbout: 'Memoir is a gentle way to capture life stories and keep them safe for your family.',
      footerLegal: 'Legal & Policies',
    },
    fr: {
      headerTagline: 'Préservez vos souvenirs pour toujours',
      navHome:'Accueil', navLogin:'Connexion', navRecord:'Enregistrer', navStories:'Mes histoires',
      footerAbout: 'Memoir est une manière douce de capturer les récits de vie et de les garder en sécurité pour votre famille.',
      footerLegal: 'Mentions & Politiques',
    },
    nl: {
      headerTagline: 'Bewaar je herinneringen voor altijd',
      navHome:'Start', navLogin:'Inloggen', navRecord:'Opnemen', navStories:'Mijn verhalen',
      footerAbout: 'Memoir helpt je levensverhalen vast te leggen en veilig te bewaren voor je familie.',
      footerLegal: 'Juridisch & Beleid',
    },
    es: {
      headerTagline: 'Preserva tus recuerdos para siempre',
      navHome:'Inicio', navLogin:'Acceder', navRecord:'Grabar', navStories:'Mis historias',
      footerAbout: 'Memoir es una forma amable de capturar historias de vida y guardarlas seguras para tu familia.',
      footerLegal: 'Aviso legal y políticas',
    }
  };

  // if no strings supplied yet, use the fallbacks
  if (!API.strings) API.strings = fallbackStrings;

  function readLang(){
    try { return localStorage.getItem(STORE_KEY) || DEFAULT_LANG; }
    catch { return DEFAULT_LANG; }
  }
  function writeLang(code){
    try { localStorage.setItem(STORE_KEY, code); } catch {}
  }

  function t(key){
    const code = API.getLang();
    const pack = API.strings[code] || API.strings[DEFAULT_LANG] || {};
    return (pack && pack[key]) || (API.strings[DEFAULT_LANG] && API.strings[DEFAULT_LANG][key]) || key;
  }

  function applyAll(root=document){
    // text nodes
    root.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.getAttribute('data-i18n');
      el.textContent = t(k);
    });
    // attribute mappings
    root.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      const spec = el.getAttribute('data-i18n-attr'); // e.g. "placeholder:heroSearch|title:searchHint"
      spec.split('|').forEach(pair=>{
        const [attr, key] = pair.split(':');
        if(attr && key) el.setAttribute(attr.trim(), t(key.trim()));
      });
    });
  }

  function setLang(code){
    if (!API.strings[code]) code = DEFAULT_LANG;
    writeLang(code);
    applyAll(document);
    // notify listeners (Record page, etc.)
    window.dispatchEvent(new CustomEvent('memoir:lang', { detail:{ code } }));
  }

  // expose API once
  if (!API._wired){
    API.getLang = readLang;
    API.setLang = setLang;
    API.t = t;
    API.applyAll = applyAll;
    API._wired = true;
  }

  // On first load, ensure DOM reflects stored language
  document.addEventListener('DOMContentLoaded', ()=> applyAll(document));
})();
