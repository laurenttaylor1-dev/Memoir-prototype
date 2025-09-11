// /js/header-loader.js
(function () {
  const HEADER_SLOT_ID = "site-header";
  const FOOTER_SLOT_ID = "site-footer";
  const HEADER_URL = "/partials/header.html";
  const FOOTER_URL = "/partials/footer.html";

  // Helper: fetch + inject with clear errors
  async function inject(slotId, url) {
    const slot = document.getElementById(slotId);
    if (!slot) {
      console.warn(`[header-loader] Slot #${slotId} not found on this page.`);
      return;
    }
    try {
      console.log(`[header-loader] fetching ${url}`);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      slot.innerHTML = html;
      console.log(`[header-loader] injected into #${slotId}`);
      // After header is injected, wire the language + nav if present
      if (slotId === HEADER_SLOT_ID) {
        window.MEMOIR_I18N && window.MEMOIR_I18N.attachHeader?.();
      }
    } catch (err) {
      console.error(`[header-loader] Failed to inject ${url}:`, err);
    }
  }

  function run() {
    inject(HEADER_SLOT_ID, HEADER_URL);
    inject(FOOTER_SLOT_ID, FOOTER_URL);
  }

  // Make sure the placeholders exist before running
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
