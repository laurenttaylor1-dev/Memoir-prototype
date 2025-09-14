(function(){
  const PARTIAL_URL = '/partials/footer.html';
  const SLOT_ID = 'site-footer';
  const LOG_PREFIX = '[footer-loader]';

  function ensureSlot() {
    let slot = document.getElementById(SLOT_ID);
    if (!slot) {
      slot = document.createElement('div');
      slot.id = SLOT_ID;
      document.body.appendChild(slot);
      console.warn(`${LOG_PREFIX} created missing <div id="${SLOT_ID}"> automatically`);
    }
    return slot;
  }

  function localizeFooter(root) {
    try {
      if (window.MEMOIR_I18N && typeof MEMOIR_I18N.applyAll === 'function') {
        MEMOIR_I18N.applyAll(root);
      }
    } catch (e) {
      console.warn(`${LOG_PREFIX} localization skipped`, e);
    }
  }

  function injectFallback(slot) {
    slot.innerHTML = `
      <footer class="site-footer" style="background:#f6f1ea;border-top:1px solid rgba(0,0,0,.06);margin-top:24px">
        <div class="site-footer-wrap" style="max-width:1200px;margin:0 auto;padding:14px 16px;text-align:center;color:#7b6a62">
          <div data-i18n="footerAbout">Memoir is a gentle way to capture life stories and keep them safe for your family.</div>
          <div><a href="/legal.html" class="pill" style="margin-top:8px;display:inline-block">Legal & Policies</a></div>
        </div>
      </footer>
    `;
    console.warn(`${LOG_PREFIX} using inline fallback footer (fetch failed)`);
  }

  async function mount() {
    const slot = ensureSlot();
    try {
      const res = await fetch(`${PARTIAL_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      slot.innerHTML = html;

      const root = slot.querySelector('.site-footer') || slot;
      localizeFooter(root);
      window.dispatchEvent(new CustomEvent('memoir:footer-ready'));
      console.info(`${LOG_PREFIX} loaded`);
    } catch (err) {
      console.error(`${LOG_PREFIX} failed to load ${PARTIAL_URL}`, err);
      injectFallback(slot);
      const root = slot.querySelector('.site-footer') || slot;
      localizeFooter(root);
      window.dispatchEvent(new CustomEvent('memoir:footer-ready'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
