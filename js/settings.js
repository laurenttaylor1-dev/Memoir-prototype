// /js/settings.js
(function () {
  const qs = id => document.getElementById(id);

  const statusEl   = qs('acctStatus');
  const bodyEl     = qs('acctBody');
  const errEl      = qs('acctErr');
  const noticeEl   = qs('topNotice');
  const emailEl    = qs('acctEmail');
  const idEl       = qs('acctId');
  const createdEl  = qs('acctCreated');
  const subBlurb   = qs('subBlurb');
  const subControls= qs('subControls');
  const subMsg     = qs('subMsg');
  const secMsg     = qs('secMsg');
  const dangerMsg  = qs('dangerMsg');

  let currentUser = null;
  let currentPlan = 'free';

  function renderUser() {
    if (!currentUser) return;
    statusEl.style.display = 'none';
    bodyEl.style.display   = 'block';
    emailEl.textContent    = currentUser.email || '—';
    idEl.textContent       = currentUser.id || '—';
    createdEl.textContent  = currentUser.created_at ? new Date(currentUser.created_at).toLocaleString() : '—';
    subControls.style.display = 'block';
  }

  async function loadSession() {
    statusEl.textContent = 'Checking your session…';
    try {
      const auth = window.MEMOIR_AUTH;
      if (!auth?.ensureClient) throw new Error('Auth client missing');
      const supa = await auth.ensureClient();

      const h = location.hash || '';
      if (h.includes('type=recovery')) { noticeEl.textContent='Set a new password below (once signed in, it will reflect here).'; noticeEl.style.display='block'; }
      else if (h.includes('type=signup')) { noticeEl.textContent='Email confirmed.'; noticeEl.style.display='block'; }

      const { data, error } = await supa.auth.getSession();
      if (error) throw error;
      const session = data?.session || null;
      if (!session) {
        const ret = encodeURIComponent(location.pathname);
        location.href = `/login.html?return=${ret}`;
        return;
      }
      currentUser = session.user;
      renderUser();

      // best-effort profile read
      try {
        const { data: prof } = await supa.from('profiles')
          .select('subscription_plan')
          .eq('user_id', currentUser.id)
          .maybeSingle();
        currentPlan = prof?.subscription_plan || 'free';
      } catch { currentPlan = 'free'; }

      subBlurb.textContent = `Current plan: ${currentPlan}`;
      document.querySelectorAll('#subControls .pill[data-plan]')
        .forEach(b => b.setAttribute('data-active', String(b.dataset.plan === currentPlan)));
    } catch (e) {
      console.error('[settings] session load failed', e);
      statusEl.textContent = 'Could not check your session.';
    }
  }

  // plan change
  document.querySelectorAll('#subControls .pill[data-plan]').forEach(btn => {
    btn.addEventListener('click', async () => {
      subMsg.textContent = '';
      const plan = btn.dataset.plan;
      try {
        const supa = await window.MEMOIR_AUTH.ensureClient();
        const { error } = await supa.from('profiles')
          .upsert({ user_id: currentUser.id, subscription_plan: plan }, { onConflict: 'user_id' });
        if (error) throw error;
        currentPlan = plan;
        subBlurb.textContent = `Current plan: ${currentPlan}`;
        document.querySelectorAll('#subControls .pill[data-plan]')
          .forEach(b => b.setAttribute('data-active', String(b.dataset.plan === plan)));
        subMsg.textContent = 'Plan updated.';
      } catch (ex) {
        subMsg.textContent = 'Could not update plan. (Profile table may not exist.)';
      }
    });
  });

  // reset password
  qs('btnResetPwd')?.addEventListener('click', async () => {
    secMsg.textContent = 'Sending…';
    try {
      const supa = await window.MEMOIR_AUTH.ensureClient();
      const { error } = await supa.auth.resetPasswordForEmail(currentUser.email, {
        redirectTo: location.origin + '/login.html#type=recovery'
      });
      if (error) throw error;
      secMsg.textContent = 'Check your inbox for a reset link.';
    } catch (ex) {
      secMsg.textContent = ex?.message || 'Could not send reset email.';
    }
  });

  // sign out
  qs('btnSignOut')?.addEventListener('click', async () => {
    errEl.textContent = '';
    try {
      const supa = await window.MEMOIR_AUTH.ensureClient();
      const { error } = await supa.auth.signOut();
      if (error) throw error;
      location.href = '/login.html';
    } catch (ex) {
      errEl.textContent = ex?.message || 'Could not sign out.';
    }
  });

  // delete profile
  qs('btnDeleteProfile')?.addEventListener('click', async () => {
    dangerMsg.textContent = 'Processing…';
    try {
      const supa = await window.MEMOIR_AUTH.ensureClient();
      try { await supa.from('profiles').delete().eq('user_id', currentUser.id); } catch {}
      await supa.auth.signOut();
      dangerMsg.textContent = 'Profile removed (if present). Redirecting…';
      setTimeout(() => location.href = '/login.html', 700);
    } catch (ex) {
      dangerMsg.textContent = ex?.message || 'Could not delete profile.';
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    loadSession();
    window.addEventListener('focus', loadSession);
  });
})();
