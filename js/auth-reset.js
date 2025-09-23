// /js/auth-reset.js
(function () {
  const $ = (id) => document.getElementById(id);

  async function ensureRecoverySession() {
    const supa = await window.MEMOIR_AUTH.ensureClient();

    // If the page was opened from the email link, detectSessionInUrl (in the singleton)
    // should have already processed the hash and created a short-lived recovery session.
    // We verify and show a friendly status if it isn't present.
    const { data, error } = await supa.auth.getSession();
    if (error) throw error;
    const session = data?.session || null;
    return { supa, session };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form   = $('newpass-form');
    const status = $('status');
    const btn    = $('updateBtn');

    // Initial hint
    status.textContent = 'If you reached this page from the email link, you can set a new password now.';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const p1 = $('password').value;
      const p2 = $('password2').value;
      if (!p1 || !p2) { status.textContent = 'Please fill both fields.'; return; }
      if (p1 !== p2)  { status.textContent = 'Passwords do not match.'; return; }

      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      status.textContent = 'Updating…';

      try {
        const { supa, session } = await ensureRecoverySession();
        if (!session) {
          status.textContent = 'Recovery session not found. Please open this page from the password reset email link again.';
          return;
        }

        const { error } = await supa.auth.updateUser({ password: p1 });
        if (error) throw error;

        status.textContent = 'Password updated. Redirecting to sign in…';
        setTimeout(() => (location.href = '/login.html#type=recovery'), 1000);
      } catch (err) {
        console.error('[reset-password] update error', err);
        status.textContent = err?.message || 'Could not update password.';
      } finally {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
      }
    });
  });
})();
