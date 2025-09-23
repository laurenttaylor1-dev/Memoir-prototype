// /js/auth-signin.js
(function () {
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    const form   = $('signin-form');
    const status = $('signin-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Signing in…';

      try {
        const supa = await window.MEMOIR_AUTH.ensureClient();

        const email = $('email').value.trim();
        const password = $('password').value;

        if (!email || !password) {
          status.textContent = 'Please enter email and password.';
          return;
        }

        const { error } = await supa.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // On success: redirect
        location.href = '/stories.html';
      } catch (err) {
        console.error('[sign-in] error', err);
        status.textContent = err?.message || 'Unable to sign in.';
      }
    });
  });
})();
