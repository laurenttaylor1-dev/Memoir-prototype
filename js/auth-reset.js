// /js/auth-reset.js
(function () {
  const $ = (id) => document.getElementById(id);

  async function ensureRecoverySession() {
    const supa = await window.MEMOIR_AUTH.ensureClient();
    const { data, error } = await supa.auth.getSession();
    if (error) throw error;
    return { supa, session: data?.session || null };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form   = $('newpass-form');
    const status = $('status');
    const btn    = $('updateBtn');

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
          status.textContent = 'Recovery session not found. Please reopen this page via the password reset email link.';
          return;
        }

        const { error } = await supa.auth.updateUser({ password: p1 });
        if (error) throw error;

        status.textContent = 'Password updated. Redirecting to sign in…';
        setTimeout(() => (location.href = '/login.html#type=recovery'), 1200);
      } catch (err) {
        console.error('[reset-password] error', err);
        status.textContent = err?.message || 'Could not update password.';
      } finally {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
      }
    });
  });
})();
