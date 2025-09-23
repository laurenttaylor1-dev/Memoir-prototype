// /js/auth-register.js
(function () {
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    const form   = $('register-form');
    const status = $('reg-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Creating account…';

      try {
        // Optional reachability probe (tolerates 401 from /auth/v1/health)
        if (window.MEMOIR_AUTH.probeConnectivity) {
          const ok = await window.MEMOIR_AUTH.probeConnectivity();
          if (!ok) throw new Error('Cannot reach authentication service from this page.');
        }

        const supa = await window.MEMOIR_AUTH.ensureClient();

        const full_name   = $('name').value.trim();
        const email       = $('email').value.trim();
        const password    = $('password').value;
        const subscription_plan = $('subscription').value;

        if (!full_name || !email || !password) {
          status.textContent = 'Please fill all fields.';
          return;
        }

        const { error } = await supa.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: location.origin + '/login.html#type=signup',
            data: {
              full_name,
              subscription_plan,
              gdpr_consent: true
            }
          }
        });
        if (error) throw error;

        status.textContent = 'Account created! Check your email to confirm, then sign in.';
        setTimeout(() => location.href = '/auth/sign-in.html', 1200);
      } catch (err) {
        console.error('[register] signUp error', err);
        status.textContent = err?.message || 'Something went wrong.';
      }
    });
  });
})();
