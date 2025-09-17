// /js/i18n-bridge.js
(function(){
  const fallbackDict = {
    en: {
      "login.title":"Welcome back",
      "login.identifierLabel":"Email or username",
      "login.identifierPH":"you@example.com or username",
      "login.passwordLabel":"Password",
      "login.passwordPH":"Your password",
      "login.submit":"Sign in",
      "login.registerToggle":"Register",
      "login.forgot":"Forgot password?",
      "login.cancel":"Cancel",
      "login.helper":"Press Enter to sign in.",

      "register.title":"Create your account",
      "register.nameLabel":"Your name",
      "register.namePH":"Jane Doe",
      "register.usernameLabel":"Username (optional)",
      "register.usernamePH":"janedoe",
      "register.emailLabel":"Email",
      "register.emailPH":"you@email.com",
      "register.passwordLabel":"Password (min 6 chars)",
      "register.passwordPH":"Password",
      "register.planLabel":"Plan",
      "register.planFree":"Free",
      "register.planBasic":"Basic",
      "register.planPro":"Pro",
      "register.gdprText":"I agree to the Terms and Privacy Policy, and consent to the processing of my data.",
      "register.submit":"Create account"
    },
    fr: { "login.title":"Bon retour", /* …add others as you like… */ },
    nl: { "login.title":"Welkom terug" },
    es: { "login.title":"Bienvenido de nuevo" }
  };

  // Prefer site's lang.js if present
  const I18N = window.MEMOIR_I18N || {
    getLang: ()=> localStorage.getItem('memoir.lang') || 'en',
    t: (k)=> (fallbackDict[localStorage.getItem('memoir.lang')||'en']||{})[k]
  };

  function apply(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = (window.MEMOIR_I18N?.t?.(key)) ?? (fallbackDict[I18N.getLang?.()||'en']||{})[key];
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      el.getAttribute('data-i18n-attr').split(',').map(s=>s.trim().split(':')).forEach(([attr,key])=>{
        const val = (window.MEMOIR_I18N?.t?.(key)) ?? (fallbackDict[I18N.getLang?.()||'en']||{})[key];
        if (val) el.setAttribute(attr, val);
      });
    });
  }

  apply();
  window.addEventListener('memoir:lang', apply);
})();
