// /js/auth-request-reset.js
(function () {
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    const form   = $('req-form');
    const status = $('status');
    const emailI = $('email');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending…';

      try {
        const supa = await window.MEMOIR_AUTH.ensureClient();

        const email = (emailI.value || '').trim();
        if (!email) {
          status.textContent = 'Please enter your email.';
          return;
        }

        const { error } = await supa.auth.resetPasswordForEmail(email, {
          // This is the page where the user will set a new password
          redirectTo: location.origin + '/auth/reset-password.html'
        });
        if (error) throw error;

        status.textContent = 'Check your inbox for a reset link.';
      } catch (err) {
        console.error('[request-reset] error', err);
        status.textContent = err?.message || 'Could not send reset email.';
      }
    });
  });
})();
