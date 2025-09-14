(function(){
  const PARTIAL_URL = '/partials/header.html';
  const SLOT_ID = 'site-header';
  const LOG_PREFIX = '[header-loader]';

  // Utility: ensure slot exists
  function ensureSlot() {
    let slot = document.getElementById(SLOT_ID);
    if (!slot) {
      slot = document.createElement('div');
      slot.id = SLOT_ID;
      // Put header at very top of body
      document.body.insertBefore(slot, document.body.firstChild);
      console.warn(`${LOG_PREFIX} created missing <div id="${SLOT_ID}"> automatically`);
    }
    return slot;
  }

  // Wire up language dropdown + click-outside close
  function initLangMenu(root) {
    const toggle = root.querySelector('#lang-toggle');
    const menu = root.querySelector('#lang-dropdown');
    if (!toggle || !menu) return;

    const open = () => { menu.hidden = false; toggle.setAttribute('aria-expanded','true'); };
    const close = () => { menu.hidden = true;  toggle.setAttribute('aria-expanded','false'); };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu.hidden) open(); else close();
    });

    // Select language
    menu.querySelectorAll('.lang-item[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-lang');
        try {
          if (window.MEMOIR_I18N && typeof MEMOIR_I18N.setLang === 'function') {
            MEMOIR_I18N.setLang(code);
            // Update visible flag/label in header
            const flag = root.querySelector('#lang-current-flag');
            const label = root.querySelector('#lang-current-label');
            if (flag) flag.textContent = MEMOIR_I18N.flags?.[code] || '🌐';
            if (label) label.textContent = MEMOIR_I18N.labels?.[code] || code.toUpperCase();

            // Re-apply translations sitewide
            if (typeof MEMOIR_I18N.applyAll === 'function') {
              MEMOIR_I18N.applyAll(document);
            }
            // Notify pages that rely on the event
            window.dispatchEvent(new CustomEvent('memoir:lang', { detail:{ code } }));
          }
        } catch (err) {
          console.error(`${LOG_PREFIX} lang change error`, err);
        } finally {
          close();
        }
      });
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!menu.hidden && !root.contains(e.target)) {
        close();
      }
    });
  }

  // After header injected, localize static strings in the header itself
  function localizeHeader(root) {
    try {
      if (window.MEMOIR_I18N && typeof MEMOIR_I18N.applyAll === 'function') {
        MEMOIR_I18N.applyAll(root);
      }
      // Also set visible current flag/label once
      const code = (window.MEMOIR_I18N && MEMOIR_I18N.getLang && MEMOIR_I18N.getLang()) || 'en';
      const flag = root.querySelector('#lang-current-flag');
      const label = root.querySelector('#lang-current-label');
      if (flag) flag.textContent = (MEMOIR_I18N.flags && MEMOIR_I18N.flags[code]) || '🌐';
      if (label) label.textContent = (MEMOIR_I18N.labels && MEMOIR_I18N.labels[code]) || code.toUpperCase();
    } catch (e) {
      console.warn(`${LOG_PREFIX} localization skipped`, e);
    }
  }

  // Fallback minimal header if the partial can’t be fetched
  function injectFallback(slot) {
    slot.innerHTML = `
      <header class="site-header" style="background:#f3eadf;border-bottom:1px solid rgba(0,0,0,.06)">
        <div class="wrap" style="max-width:1200px;margin:0 auto;padding:12px 16px;display:flex;gap:16px;align-items:center;justify-content:space-between">
          <a class="brand" href="/landing.html" style="display:flex;gap:10px;text-decoration:none;color:#3b2f2a">
            <span class="logo" style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#8c5a3c,#b17d55)"></span>
            <span class="brand-text"><strong>MEMOIR APP</strong><small style="display:block;color:#7b6a62;font-size:12px">Preserve your memories forever</small></span>
          </a>
          <nav class="nav" style="display:flex;gap:10px;align-items:center">
            <a class="pill" href="/landing.html">Home</a>
            <a class="pill" href="/login.html">Login</a>
            <a class="pill" href="/record.html">Record</a>
            <a class="pill" href="/stories.html">My Stories</a>
          </nav>
        </div>
      </header>
    `;
    console.warn(`${LOG_PREFIX} using inline fallback header (fetch failed)`);
  }

  async function mount() {
    const slot = ensureSlot();
    try {
      const res = await fetch(`${PARTIAL_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      slot.innerHTML = html;

      const root = slot.querySelector('.site-header') || slot;
      initLangMenu(root);
      localizeHeader(root);

      // let pages know header is ready
      window.dispatchEvent(new CustomEvent('memoir:header-ready'));
      console.info(`${LOG_PREFIX} loaded`);
    } catch (err) {
      console.error(`${LOG_PREFIX} failed to load ${PARTIAL_URL}`, err);
      injectFallback(slot);
      const root = slot.querySelector('.site-header') || slot;
      localizeHeader(root);
      window.dispatchEvent(new CustomEvent('memoir:header-ready'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
