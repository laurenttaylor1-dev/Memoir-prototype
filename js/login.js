// /js/login.js
// Page logic for login/register/reset — uses MEMOIR_AUTH (no inline JS)

(function () {
  function qs(id) { return document.getElementById(id); }

  async function initBanner() {
    const n = qs('topNotice');
    const hash = location.hash || '';
    if (!n) return;

    if (hash.includes('type=signup')) {
      try {
        const supa = await window.MEMOIR_AUTH.ensureClient();
        const { data } = await supa.auth.getUser();
        const user = data?.user || null;
        n.textContent = user ? 'Email confirmed — you are signed in.' : 'Email confirmed — you can sign in now.';
        n.style.display = 'block';
        if (user) setTimeout(() => location.href = '/settings.html', 1200);
      } catch {
        n.textContent = 'Email confirmed — you can sign in now.';
        n.style.display = 'block';
      }
    } else if (hash.includes('type=recovery')) {
      n.textContent = 'Open this page to set a new password (Settings will reflect the change).';
      n.style.display = 'block';
    }
  }

  function initToggles() {
    const regPanel = qs('registerPanel');
    const resetPanel = qs('resetPanel');

    qs('toggleRegister')?.addEventListener('click', () => {
      const open = regPanel.classList.toggle('open');
      regPanel.setAttribute('aria-hidden', String(!open));
      if (open) qs('reg_first')?.focus();
    });

    qs('toggleReset')?.addEventListener('click', () => {
      const open = resetPanel.classList.toggle('open');
      resetPanel.setAttribute('aria-hidden', String(!open));
      if (open) qs('reset_email')?.focus();
    });

    qs('closeReset')?.addEventListener('click', () => {
      resetPanel.classList.remove('open');
      resetPanel.setAttribute('aria-hidden', 'true');
    });
  }

  function initLoginForm() {
    const form = qs('loginForm');
    const err = qs('loginError');
    const btn = qs('loginSubmit');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); err.textContent = ''; btn.disabled = true; btn.setAttribute('aria-busy', 'true');
      try {
        const ok = await window.MEMOIR_AUTH.probeConnectivity();
        if (!ok) throw new Error('Cannot reach authentication service from this page.');

        const supa = await window.MEMOIR_AUTH.ensureClient();
        const email = qs('identifier').value.trim();
        const password = qs('password').value;
        if (!email || !password) { err.textContent = 'Please fill email and password.'; return; }

        const { error } = await supa.auth.signInWithPassword({ email, password });
        if (error) throw error;

        location.href = window.MEMOIR_AUTH.getReturnPath();
      } catch (ex) {
        console.error('[login] sign-in error', ex);
        err.textContent = ex?.message || 'Sign in failed. Please try again.';
      } finally {
        btn.disabled = false; btn.removeAttribute('aria-busy');
      }
    });
  }

  function initRegisterForm() {
    const form = qs('registerForm');
    const panel = qs('registerPanel');
    const err = qs('registerError');
    const btn = qs('registerSubmit');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); err.textContent = ''; err.style.color = '#a23a3a';
      btn.disabled = true; btn.setAttribute('aria-busy', 'true');

      try {
        const ok = await window.MEMOIR_AUTH.probeConnectivity();
        if (!ok) throw new Error('Cannot reach authentication service from this page.');

        const supa = await window.MEMOIR_AUTH.ensureClient();
        const first    = qs('reg_first').value.trim();
        const last     = qs('reg_last').value.trim();
        const email    = qs('reg_email').value.trim();
        const password = qs('reg_password').value;
        const plan     = qs('reg_plan').value;
        const gdprOk   = qs('reg_gdpr').checked;
        if (!gdprOk) { err.textContent = 'Please agree to the Terms and Privacy Policy.'; return; }
        const full_name = `${first} ${last}`.trim();

        const { error } = await supa.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: location.origin + '/login.html#type=signup',
            data: { first_name:first, last_name:last, full_name, subscription_plan: plan, gdpr_consent: true }
          }
        });
        if (error) throw error;

        // Success UI
        panel.classList.add('open');
        panel.setAttribute('aria-hidden','false');
        panel.innerHTML = (
          '<div class="card" style="background:#e9f7ef;border-color:#c7ebd2">' +
            '<h2 class="title" style="font-size:22px;margin:0 0 8px;">Account created</h2>' +
            '<p class="helper" style="color:#1b5e20">Please check your email to confirm your account. After confirming, you’ll be signed in automatically.</p>' +
            '<div class="actions" style="margin-top:10px">' +
              '<a class="btn primary" href="/login.html">Back to sign in</a>' +
            '</div>' +
          '</div>'
        );
        window.scrollTo({ top: panel.offsetTop - 20, behavior: 'smooth' });
      } catch (ex) {
        err.textContent = ex?.message || 'Registration failed.';
      } finally {
        btn.disabled = false; btn.removeAttribute('aria-busy');
      }
    });
  }

  function initResetForm() {
    const form = qs('resetForm');
    const msg  = qs('resetMsg');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); msg.textContent = 'Sending…';
      try {
        const ok = await window.MEMOIR_AUTH.probeConnectivity();
        if (!ok) throw new Error('Cannot reach authentication service from this page.');

        const supa = await window.MEMOIR_AUTH.ensureClient();
        const email = qs('reset_email').value.trim();
        const { error } = await supa.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/login.html#type=recovery' });
        if (error) throw error;
        msg.textContent = 'Check your inbox for a reset link.';
      } catch (ex) {
        msg.textContent = ex?.message || 'Could not send reset email.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initBanner();
    initToggles();
    initLoginForm();
    initRegisterForm();
    initResetForm();
  });
})();
