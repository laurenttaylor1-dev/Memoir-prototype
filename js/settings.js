// /js/settings.js
(function(){
  const I18N = window.MEMOIR_I18N;
  const tr = (k, vars, fb) => I18N?.translate?.(k, vars) ?? fb ?? k;

  const titleEl    = document.getElementById('settingsTitle');
  const statusEl   = document.getElementById('acctStatus');
  const bodyEl     = document.getElementById('acctBody');
  const errEl      = document.getElementById('acctErr');
  const subBlurb   = document.getElementById('subBlurb');
  const subCtrls   = document.getElementById('subControls');

  const emailEl    = document.getElementById('acctEmail');
  const idEl       = document.getElementById('acctId');
  const createdEl  = document.getElementById('acctCreated');

  const btnSignOut = document.getElementById('btnSignOut');
  const btnReset   = document.getElementById('btnResetPwd');

  function firstName(n){ return (n||'').trim().split(/\s+/)[0] || ''; }
  const withTimeout = (p, ms=9000) => Promise.race([p, new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);

  async function load(){
    try {
      const supa = await window.MEMOIR_AUTH.ensureClient();
      const { data } = await withTimeout(supa.auth.getUser());
      const user = data?.user || null;

      if (!user) {
        statusEl.innerHTML = tr('settingsAccountSignedOut', null, 'You are <strong class="warn">not signed in</strong>.');
        bodyEl.style.display = 'none';
        subBlurb.textContent = tr('settingsSubscriptionSignIn', null, 'Sign in to see or change your plan.');
        subCtrls.style.display = 'none';
        return;
      }

      // Profile & greeting
      let profile=null;
      try {
        const { data: p } = await supa.from('profiles').select('full_name, subscription_plan').eq('user_id', user.id).single();
        profile = p || {};
      } catch {}

      const name = profile?.full_name || user.email || '';
      const fname = firstName(name);
      // "Welcome back, {name}"
      titleEl.textContent = fname ? `${tr('settingsTitle',null,'Settings')} — ${tr('recordGreeting',{name:fname},`Welcome back, ${fname}`)}` : tr('settingsTitle',null,'Settings');

      statusEl.style.display = 'none';
      bodyEl.style.display = 'block';
      emailEl.textContent   = user.email || '—';
      idEl.textContent      = user.id || '—';
      createdEl.textContent = user.created_at ? new Date(user.created_at).toLocaleString() : '—';

      const plan = profile?.subscription_plan || 'free';
      subBlurb.textContent = tr('settingsSubscriptionCurrent', { plan: tr(`planLabel_${plan}`, null, plan) }, `Current plan: ${plan}`);
      subCtrls.style.display = 'block';
    } catch (e) {
      console.error('[settings] load failed', e);
      statusEl.textContent = e?.message === 'timeout' ? 'Auth is slow to respond. Please refresh.' : 'Could not check your session.';
      bodyEl.style.display = 'none';
      subCtrls.style.display = 'none';
    }
  }

  btnSignOut?.addEventListener('click', async ()=>{
    errEl.textContent = '';
    try{
      const supa = await window.MEMOIR_AUTH.ensureClient();
      const { error } = await supa.auth.signOut();
      if (error) throw error;
      location.href = '/login.html';
    }catch(ex){ errEl.textContent = ex?.message || 'Could not sign out.'; }
  });

  btnReset?.addEventListener('click', async ()=>{
    const supa = await window.MEMOIR_AUTH.ensureClient();
    const { data } = await supa.auth.getUser();
    const user = data?.user || null;
    const secMsg = document.getElementById('secMsg');
    if (!user){ secMsg.textContent = 'Please sign in first.'; return; }
    try{
      const { error } = await supa.auth.resetPasswordForEmail(user.email, { redirectTo: location.origin + '/auth/reset-password.html' });
      if (error) throw error;
      secMsg.textContent = 'Check your inbox for a reset link.';
    }catch(err){ secMsg.textContent = err?.message || 'Could not send reset email.'; }
  });

  document.addEventListener('DOMContentLoaded', load);
  window.addEventListener('focus', load);
  window.addEventListener('memoir:lang', load);
})();
