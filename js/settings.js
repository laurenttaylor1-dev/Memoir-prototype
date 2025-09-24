// /js/settings.js
// Renders Settings page safely (CSP-friendly, null-safe)

(async function () {
  function $(id) { return document.getElementById(id); }

  // i18n helpers (optional)
  const I18N = window.MEMOIR_I18N;
  const getLang = () => (I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');
  const tr = (k, vars, fallback='') =>
    I18N?.translate?.(k, vars, getLang()) ??
    I18N?.translate?.(k, vars, 'en') ??
    I18N?.t?.(k, getLang()) ??
    I18N?.t?.(k, 'en') ??
    fallback;

  // DOM refs (resolved after DOM ready)
  let acctStatus, acctBody, acctErr, acctActions, subBlurb, subControls, planDetails;

  function bindDomRefs() {
    acctStatus   = $('acctStatus');
    acctBody     = $('acctBody');
    acctErr      = $('acctErr');
    acctActions  = $('acctActions');
    subBlurb     = $('subBlurb');
    subControls  = $('subControls');
    planDetails  = $('planDetails');
  }

  // Ensure one Supabase client (via shared auth-client.js)
  async function getClient() {
    try {
      if (!window.MEMOIR_AUTH?.ensureClient) {
        // auth-client.js wasn’t loaded or meta tags missing
        throw new Error('Supabase URL/Key not found (auth-client)');
      }
      return await window.MEMOIR_AUTH.ensureClient();
    } catch (e) {
      console.error('[settings] ensureClient failed:', e);
      throw e;
    }
  }

  function setSignedOutUI() {
    if (acctStatus) acctStatus.textContent = tr('settingsAccountChecking', null, 'Checking your session…');
    if (acctBody)   acctBody.style.display = 'none';
    if (acctErr)    acctErr.textContent = '';
    if (acctActions) acctActions.style.display = 'flex';
    if (subBlurb)   subBlurb.textContent = tr('settingsSubscriptionSignIn', null, 'Sign in to see or change your plan.');
    if (subControls) subControls.style.display = 'none';
  }

  function setSignedInUI(user, profile) {
    if (acctActions) acctActions.style.display = 'none';
    if (acctStatus)  acctStatus.style.display = 'none';
    if (acctBody)    acctBody.style.display = 'block';

    const fullName = profile?.full_name || user.email || 'Your account';
    const email = user.email || '—';
    const created = user.created_at ? new Date(user.created_at).toLocaleString() : '—';

    const emailEl   = $('acctEmail');
    const idEl      = $('acctId');
    const createdEl = $('acctCreated');
    if (emailEl)   emailEl.textContent   = email;
    if (idEl)      idEl.textContent      = user.id || '—';
    if (createdEl) createdEl.textContent = created;

    const plan = profile?.subscription_plan || 'free';
    if (subBlurb) {
      subBlurb.textContent = tr('settingsSubscriptionCurrent', { plan }, `Current plan: ${plan}`);
    }
    if (subControls) {
      subControls.style.display = 'block';
      highlightPlan(plan);
      showPlanDetails(plan);
    }
  }

  function highlightPlan(code) {
    const wrap = $('planButtons');
    if (!wrap) return;
    wrap.querySelectorAll('[data-plan]').forEach(b => {
      b.setAttribute('data-active', String(b.dataset.plan === code));
    });
  }

  function showPlanDetails(code) {
    if (!planDetails) return;
    const labels = {
      free:        'Free plan — basic features.',
      storyteller: 'Storyteller — 3h/mo transcription.',
      premium:     'Premium Storyteller — 6h/mo transcription.',
      exclusive:   'Exclusive Storyteller — 10h/mo transcription.'
    };
    planDetails.textContent = labels[code] || code;
  }

  async function loadSession() {
    try {
      const supa = await getClient();
      const { data, error } = await supa.auth.getUser();
      const user = data?.user || null;

      if (error || !user) {
        setSignedOutUI();
        if (acctStatus) acctStatus.textContent = tr('settingsAccountSignedOut', null, 'You are not signed in.');
        return;
      }

      // fetch profile (optional table)
      let profile = {};
      try {
        const { data: p } = await supa
          .from('profiles')
          .select('full_name, subscription_plan')
          .eq('user_id', user.id)
          .single();
        profile = p || {};
      } catch (e) {
        console.warn('[settings] profile fetch failed', e);
      }

      setSignedInUI(user, profile);
    } catch (e) {
      console.error('[settings] load failed', e);
      if (acctStatus) acctStatus.textContent = 'Could not check your session.';
      setSignedOutUI();
    }
  }

  function wireActions() {
    const signOutBtn = $('btnSignOut');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        try {
          const supa = await getClient();
          await supa.auth.signOut();
        } catch (e) {
          console.warn('[settings] sign out failed', e);
        } finally {
          location.href = '/login.html';
        }
      });
    }

    const wrap = $('planButtons');
    if (wrap) {
      wrap.querySelectorAll('[data-plan]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const plan = btn.dataset.plan;
          highlightPlan(plan);
          showPlanDetails(plan);

          try {
            const supa = await getClient();
            const { data: u } = await supa.auth.getUser();
            const user = u?.user;
            if (!user) return;

            // upsert plan (if column exists)
            await supa.from('profiles')
              .upsert({ user_id: user.id, subscription_plan: plan }, { onConflict: 'user_id' });
            if (subBlurb) {
              subBlurb.textContent = tr('settingsSubscriptionCurrent', { plan }, `Current plan: ${plan}`);
            }
          } catch (e) {
            console.warn('[settings] plan update failed', e);
          }
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    bindDomRefs();
    wireActions();
    await loadSession();
    window.addEventListener('focus', loadSession);
    window.addEventListener('memoir:lang', loadSession);
  });
})();
