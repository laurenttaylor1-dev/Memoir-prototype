// /js/settings.js
// Settings page: show plan details, start Stripe checkout, open billing portal

(async function () {
  const $ = (id) => document.getElementById(id);
  const I18N = window.MEMOIR_I18N;
  const getLang = () => (I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');
  const tr = (k, vars, fb='') =>
    I18N?.translate?.(k, vars, getLang()) ??
    I18N?.translate?.(k, vars, 'en') ??
    I18N?.t?.(k, getLang()) ??
    I18N?.t?.(k, 'en') ??
    fb;

  // --- Pricing + perk copies (adjust to your real prices) ---
  const PRICES = {
    free:        { label: 'Free',                   amount: 0,     pretty: '€0 / mo',          perks: ['Up to 10 stories', '2 min per recording cap', 'Private library'] },
    storyteller: { label: 'Storyteller',            amount: 6.99,  pretty: '€6.99 / mo',       perks: ['3 hours transcription / month', 'AI rewrite & export', 'Priority processing'] },
    premium:     { label: 'Premium Storyteller',    amount: 11.99, pretty: '€11.99 / mo',      perks: ['6 hours transcription / month', 'AI rewrite & export', 'Priority processing'] },
    exclusive:   { label: 'Exclusive Storyteller',  amount: 15.99, pretty: '€15.99 / mo',      perks: ['10 hours transcription / month', 'AI rewrite & export', 'Priority support'] },
  };

  // DOM
  let acctStatus, acctBody, acctActions, subBlurb, subControls, planBox, planPrice, planPerks, btnSubscribe, btnManage, planMsg;

  function bind() {
    acctStatus   = $('acctStatus');
    acctBody     = $('acctBody');
    acctActions  = $('acctActions');
    subBlurb     = $('subBlurb');
    subControls  = $('subControls');

    planBox      = $('planBox');
    planPrice    = $('planPrice');
    planPerks    = $('planPerks');
    btnSubscribe = $('btnSubscribe');
    btnManage    = $('btnManage');
    planMsg      = $('planMsg');

    // sign out
    const signOutBtn = $('btnSignOut');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        try {
          const supa = await ensureClient();
          await supa.auth.signOut();
        } finally {
          location.href = '/login.html';
        }
      });
    }
  }

  async function ensureClient() {
    if (!window.MEMOIR_AUTH?.ensureClient) {
      throw new Error('Supabase client unavailable (auth-client.js not loaded)');
    }
    return window.MEMOIR_AUTH.ensureClient();
  }

  function setSignedOutUI() {
    if (acctActions)  acctActions.style.display = 'flex';
    if (acctBody)     acctBody.style.display = 'none';
    if (subControls)  subControls.style.display = 'none';
    if (subBlurb)     subBlurb.textContent = tr('settingsSubscriptionSignIn', null, 'Sign in to see or change your plan.');
  }

  function highlightPlan(code) {
    const wrap = $('planButtons');
    if (!wrap) return;
    wrap.querySelectorAll('[data-plan]').forEach(b => {
      b.setAttribute('data-active', String(b.dataset.plan === code));
    });
  }

  function renderPlanDetails(selectCode, currentPlan) {
    const plan = PRICES[selectCode];
    if (!plan || !planBox) return;

    planBox.style.display = 'block';
    planPrice.textContent = `${plan.label} — ${plan.pretty}`;
    planPerks.innerHTML = '';
    plan.perks.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      planPerks.appendChild(li);
    });

    // Buttons:
    // - If user is on free and selected a paid plan => show Subscribe
    // - If user is already paid => show Manage billing
    // - If user is clicking the plan they already have => hide Subscribe (or disable)
    const isPaid = currentPlan && currentPlan !== 'free';
    const selectingCurrent = selectCode === currentPlan;

    if (!isPaid) {
      // Free user
      btnManage.style.display = 'none';
      if (selectCode === 'free') {
        btnSubscribe.style.display = 'none';
      } else {
        btnSubscribe.style.display = 'inline-flex';
        btnSubscribe.disabled = false;
        btnSubscribe.dataset.plan = selectCode;
      }
    } else {
      // Paid user
      btnSubscribe.style.display = 'none';
      btnManage.style.display = 'inline-flex';
    }
    planMsg.textContent = '';
  }

  async function startCheckout(plan) {
    try {
      btnSubscribe.disabled = true;
      planMsg.textContent = 'Opening checkout…';
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })   // your server should map plan -> Stripe price/product
      });
      if (!res.ok) {
        const t = await res.text().catch(()=> '');
        throw new Error(t || `Checkout error (${res.status})`);
      }
      const json = await res.json();
      if (json.url) {
        location.href = json.url;  // redirect to Stripe Checkout
      } else {
        throw new Error('No checkout URL returned.');
      }
    } catch (e) {
      console.error(e);
      planMsg.textContent = e.message || 'Could not start checkout.';
      btnSubscribe.disabled = false;
    }
  }

  async function openBillingPortal() {
    try {
      btnManage.disabled = true;
      planMsg.textContent = 'Opening billing portal…';
      // Adjust if your endpoint is different:
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'portal' })
      });
      if (!res.ok) throw new Error(`Portal error (${res.status})`);
      const json = await res.json();
      if (json.url) location.href = json.url;
      else throw new Error('No portal URL returned.');
    } catch (e) {
      console.error(e);
      planMsg.textContent = e.message || 'Could not open billing portal.';
      btnManage.disabled = false;
    }
  }

  async function loadSessionAndWirePlans() {
    const supa = await ensureClient();
    const { data } = await supa.auth.getUser();
    const user = data?.user || null;

    if (!user) {
      if (acctStatus) acctStatus.textContent = tr('settingsAccountSignedOut', null, 'You are not signed in.');
      setSignedOutUI();
      return { user: null, plan: 'free' };
    }

    // Fill account section
    if (acctActions) acctActions.style.display = 'none';
    if (acctStatus)  acctStatus.style.display = 'none';
    if (acctBody)    acctBody.style.display = 'block';
    $('acctEmail')  && ( $('acctEmail').textContent  = user.email || '—' );
    $('acctId')     && ( $('acctId').textContent     = user.id || '—' );
    $('acctCreated')&& ( $('acctCreated').textContent = user.created_at ? new Date(user.created_at).toLocaleString() : '—' );

    // Get profile for plan
    let plan = 'free';
    try {
      const prof = await supa.from('profiles').select('full_name, subscription_plan').eq('user_id', user.id).single();
      plan = prof?.data?.subscription_plan || 'free';
    } catch {}

    if (subControls) subControls.style.display = 'block';
    if (subBlurb)    subBlurb.textContent = `Current plan: ${PRICES[plan]?.pretty || plan}`;

    // Wire plan buttons
    const wrap = $('planButtons');
    if (wrap) {
      highlightPlan(plan);
      wrap.querySelectorAll('[data-plan]').forEach(btn => {
        btn.addEventListener('click', () => {
          const sel = btn.dataset.plan;
          highlightPlan(sel);
          renderPlanDetails(sel, plan);
        });
      });
      // show selected/current on load
      renderPlanDetails(plan, plan);
    }

    // Subscribe / Manage actions
    if (btnSubscribe) {
      btnSubscribe.addEventListener('click', () => {
        const plan = btnSubscribe.dataset.plan;
        if (plan) startCheckout(plan);
      });
    }
    if (btnManage) {
      btnManage.addEventListener('click', openBillingPortal);
    }

    return { user, plan };
  }

  document.addEventListener('DOMContentLoaded', async () => {
    bind();
    try {
      await loadSessionAndWirePlans();
    } catch (e) {
      console.error('[settings] load failed', e);
      if (acctStatus) acctStatus.textContent = 'Could not check your session.';
      setSignedOutUI();
    }
    window.addEventListener('focus', loadSessionAndWirePlans);
    window.addEventListener('memoir:lang', loadSessionAndWirePlans);
  });
})();
