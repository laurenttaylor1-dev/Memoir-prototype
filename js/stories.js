// /js/stories.js
(function () {
  const qs = (id) => document.getElementById(id);

  const I18N = window.MEMOIR_I18N;
  function getLangCode(){ return I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en'; }
  function tr(key, vars, fallback=''){
    return I18N?.translate?.(key, vars, getLangCode())
        || I18N?.translate?.(key, vars, 'en')
        || I18N?.t?.(key, getLangCode())
        || I18N?.t?.(key, 'en')
        || fallback;
  }
  function firstName(full){ return (full||'').trim().split(/\s+/)[0] || ''; }

  const listEl         = qs('storiesList');
  const inviteEmail    = qs('inviteEmail');
  const inviteBtn      = qs('inviteBtn');
  const inviteMsg      = qs('inviteMsg');
  const pageTitle      = qs('pageTitle');
  const countStoriesEl = qs('countStories');
  const countFamilyEl  = qs('countFamily');

  let currentFirst = '';

  function updatePageTitle(){
    if (!pageTitle) return;
    if (currentFirst){
      pageTitle.textContent = tr('storiesGreeting', { name: currentFirst }, tr('storiesTitle', null, 'My Stories'));
    } else {
      pageTitle.textContent = tr('storiesTitle', null, 'My Stories');
    }
  }

  function renderEmpty(message){
    listEl.innerHTML = `<div class="empty">${message}</div>`;
  }

  async function loadEverything(){
    try{
      const supa = await window.MEMOIR_AUTH.ensureClient();

      // session
      const { data: userData } = await supa.auth.getUser();
      const user = userData?.user || null;
      if (!user){
        currentFirst = '';
        updatePageTitle();
        countStoriesEl.textContent = '0';
        countFamilyEl.textContent = '0';
        renderEmpty(tr('storiesNeedSignIn', null, 'Please <a href="/login.html">sign in</a>.'));
        return;
      }

      // profile name
      try{
        const { data: prof } = await supa.from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();
        currentFirst = prof?.full_name ? firstName(prof.full_name) : '';
      }catch{ currentFirst = ''; }
      updatePageTitle();

      // stories
      try{
        const { data, error } = await supa
          .from('stories')
          .select('id,title,created_at,visibility')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const stories = data || [];
        countStoriesEl.textContent = String(stories.length);

        if (!stories.length){
          renderEmpty(tr('storiesEmpty', null, 'No stories yet. Record your first one!'));
        } else {
          listEl.innerHTML = stories.map(s => {
            const when = new Date(s.created_at).toLocaleString();
            const title = s.title || tr('storiesUntitled', null, 'Untitled');
            const vis = s.visibility || 'private';
            const visibilityLabel = tr(`storiesVisibility_${vis}`, null, vis);
            const rewriteLabel = tr('storiesRewriteButton', null, 'Rewrite with AI');
            const continueLabel = tr('storiesContinueButton', null, 'Continue');
            return `
              <article class="story-card" data-id="${s.id}">
                <h3>${title}</h3>
                <div class="meta">${when} · ${visibilityLabel}</div>
                <div class="actions">
                  <button class="pill" data-rewrite="1">${rewriteLabel}</button>
                  <a class="pill" href="/record.html">${continueLabel}</a>
                </div>
                <div class="muted" data-msg style="margin-top:6px;min-height:1.1em"></div>
              </article>
            `;
          }).join('');

          listEl.querySelectorAll('[data-rewrite]').forEach(btn => {
            btn.addEventListener('click', async () => {
              const card = btn.closest('.story-card');
              const id = card?.dataset?.id;
              const msg = card?.querySelector('[data-msg]');
              if (!id || !msg) return;
              msg.textContent = tr('storiesRewriteWorking', null, 'Rewriting…');
              try {
                const res = await fetch('/api/rewrite', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ story_id: id })
                });
                if (!res.ok) throw new Error('Server error');
                const json = await res.json();
                msg.textContent = json.message || tr('storiesRewriteDone', null, 'Done.');
              } catch (e) {
                msg.textContent = tr('storiesRewriteFailed', { error: e.message || e }, 'Could not rewrite: ' + (e.message || e));
              }
            });
          });
        }
      }catch(e){
        renderEmpty(tr('storiesLoadError', { error: e.message || e }, `Could not load stories: ${e.message || e}`));
      }

      // invites count
      try{
        const { data, error } = await supa
          .from('family_invites')
          .select('id,status')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const accepted = (data || []).filter(i => (i.status || 'pending') !== 'revoked');
        countFamilyEl.textContent = String(accepted.length);
      }catch{
        countFamilyEl.textContent = '0';
      }
    }catch(err){
      // If ensureClient fails (e.g., CSP), render a friendly message
      renderEmpty(tr('storiesLoadError', { error: err.message || err }, `Could not load stories: ${err.message || err}`));
    }
  }

  function initInvite(){
    inviteBtn?.addEventListener('click', async () => {
      const email = inviteEmail.value.trim();
      if (!email){ inviteMsg.textContent = tr('storiesInviteEnterEmail', null, 'Enter an email.'); return; }
      try{
        const supa = await window.MEMOIR_AUTH.ensureClient();
        const { data } = await supa.auth.getUser();
        const user = data?.user || null;
        if (!user){ inviteMsg.textContent = tr('storiesInviteSignIn', null, 'Please sign in first.'); return; }
        inviteMsg.textContent = tr('storiesInviteSending', null, 'Sending…');
        const res = await supa.from('family_invites').insert({ owner_id: user.id, email, status: 'pending' });
        if (res.error) throw res.error;
        inviteMsg.textContent = tr('storiesInviteSaved', null, 'Invite saved. We’ll email instructions when mail is configured.');
        inviteEmail.value = '';
        loadEverything();
      }catch(e){
        inviteMsg.textContent = tr('storiesInviteError', { error: e.message || e }, 'Could not save invite: ' + (e.message || e));
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadEverything();
    initInvite();
    window.addEventListener('memoir:lang', () => {
      I18N?.applyAll?.(document);
      loadEverything();
    });
  });
})();
