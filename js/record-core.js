/* /js/record-core.js
 * Core logic for:
 *  - Supabase auth/session + personalization (greeting, plan note)
 *  - Microphone recording (MediaRecorder)
 *  - Whisper transcription via /api/transcribe-chunk
 *  - Save story: stories + optional notes/when_text + storage uploads + story_texts
 *  - Free/Guided tabs are rendered by /js/record.js; this file exposes hooks it needs.
 */
(function () {
  // ---- i18n helpers ---------------------------------------------------------
  const I18N = window.MEMOIR_I18N || {};
  const t = (key, vars, code) =>
    (I18N.translate && I18N.translate(key, vars, code)) ||
    (I18N.t && I18N.t(key, code)) ||
    null;
  const getLang = () =>
    (I18N.getLang && I18N.getLang()) || localStorage.getItem('memoir.lang') || 'en';
  const tr = (key, vars, fallback) => t(key, vars, getLang()) || t(key, vars, 'en') || fallback || '';

  // ---- DOM refs -------------------------------------------------------------
  let pageTitle, planNote, micBtn, timerEl, msgEl, preview, transcriptBox, asrHint,
      photoInput, saveBtn, titleInput, whenInput, notesInput, tabFree, tabGuided;

  function cacheEls() {
    pageTitle     = document.getElementById('pageTitle');
    planNote      = document.getElementById('planNote');
    micBtn        = document.getElementById('mic');
    timerEl       = document.getElementById('timer');
    msgEl         = document.getElementById('recMsg');
    preview       = document.getElementById('preview');
    transcriptBox = document.getElementById('transcript');
    asrHint       = document.getElementById('asrHint');
    photoInput    = document.getElementById('photo');
    saveBtn       = document.getElementById('saveBtn');
    titleInput    = document.getElementById('title');
    whenInput     = document.getElementById('when');
    notesInput    = document.getElementById('notes');
    tabFree       = document.getElementById('tabFree');
    tabGuided     = document.getElementById('tabGuided');
  }

  // ---- State ----------------------------------------------------------------
  const state = {
    supa: null,
    hasSession: false,
    firstName: '',
    plan: 'free',
    // recording
    mediaStream: null,
    recorder: null,
    chunks: [],
    startedAt: 0,
    tickHandle: null,
    previewUrl: null,
    pendingAudio: null,
    pendingTranscript: '',
    pendingTranscribing: false,
    transcriptPlaceholder: 'Your words will appear here…',
    isSaving: false,
  };

  // ---- Personalization ------------------------------------------------------
  function firstName(full) {
    if (!full) return '';
    const n = String(full).trim();
    if (!n) return '';
    // if it looks like an email, take the part before @ and split by non-letters
    if (n.includes('@')) return n.split('@')[0].split(/[.\-_]/)[0];
    return n.split(/\s+/)[0];
  }

  function updatePageTitle() {
    if (!pageTitle) return;
    if (state.firstName) {
      pageTitle.textContent = tr('recordGreeting', { name: state.firstName }, 'Record');
    } else {
      pageTitle.textContent = tr('recordTitle', null, 'Record');
    }
  }

  function planLabel(code) {
    return tr(`planLabel_${code}`, null, code);
  }

  function updatePlanNote() {
    if (!planNote) return;
    if (!state.hasSession) {
      planNote.textContent = '';
      return;
    }
    if (state.plan === 'free') {
      planNote.textContent = tr('recordPlanFreeNote', null,
        'Free plan: recordings over 2 minutes are not allowed. Upgrade in Settings for higher limits.');
    } else {
      planNote.textContent = tr('recordPlanGeneric', { plan: planLabel(state.plan) }, `Plan: ${state.plan}`);
    }
  }

  async function initSession() {
    try {
      state.supa = await window.MEMOIR_AUTH.ensureClient();
      const { data: userData } = await state.supa.auth.getUser();
      const user = userData?.user || null;
      state.hasSession = !!user;
      if (!user) {
        state.firstName = '';
        state.plan = 'free';
        updatePageTitle();
        updatePlanNote();
        return;
      }
      // profile: full_name + subscription_plan
      try {
        const { data } = await state.supa
          .from('profiles')
          .select('full_name, subscription_plan')
          .eq('user_id', user.id)
          .single();
        state.firstName = firstName(data?.full_name) || firstName(user.email);
        state.plan = data?.subscription_plan || 'free';
      } catch {
        state.firstName = firstName(user.email);
        state.plan = 'free';
      }
      updatePageTitle();
      updatePlanNote();
    } catch (err) {
      console.warn('[record-core] session init failed', err);
      state.hasSession = false;
      state.firstName = '';
      state.plan = 'free';
      updatePageTitle();
      updatePlanNote();
    }
  }

  // ---- UI helpers -----------------------------------------------------------
  function fmt(sec) {
    sec = Math.max(0, sec | 0);
    const m = (sec / 60) | 0;
    const r = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  function refreshTranscriptPlaceholder(force = false) {
    const next = tr('recordTranscriptPlaceholder', null, 'Your words will appear here…');
    const currentText = (transcriptBox.textContent || '').trim();
    const hadPlaceholder = !state.pendingTranscript && (!currentText || currentText === state.transcriptPlaceholder);
    state.transcriptPlaceholder = next;
    if (force || hadPlaceholder) {
      transcriptBox.textContent = state.transcriptPlaceholder;
    }
  }

  function updateMicLabel() {
    if (!micBtn) return;
    if (state.recorder && state.recorder.state === 'recording') {
      micBtn.textContent = tr('recordMicStop', null, 'Stop');
    } else {
      micBtn.textContent = tr('recordMicStart', null, 'Record');
    }
  }

  function getTranscriptText() {
    const text = (transcriptBox.textContent || '').trim();
    if (!text || text === state.transcriptPlaceholder) return '';
    return text;
  }

  function hasStoryContent() {
    return !!state.pendingAudio || !!getTranscriptText() || !!notesInput.value.trim() || (photoInput.files && photoInput.files.length > 0);
  }

  function updateSaveButtonLabel() {
    if (!saveBtn || state.isSaving) return;
    saveBtn.textContent = tr('recordSaveButton', null, 'Save story');
  }

  function updateSaveState() {
    if (!saveBtn) return;
    saveBtn.disabled = state.pendingTranscribing || !hasStoryContent();
  }

  function setMsg(kind, text) {
    if (!msgEl) return;
    msgEl.className = kind === 'ok' ? 'ok' : kind === 'warn' ? 'muted warn' : 'muted';
    msgEl.innerHTML = text;
  }

  // ---- Recording ------------------------------------------------------------
  function startTimer() {
    state.startedAt = Date.now();
    clearInterval(state.tickHandle);
    state.tickHandle = setInterval(() => {
      const sec = ((Date.now() - state.startedAt) / 1000) | 0;
      timerEl.textContent = fmt(sec);
      if (state.plan === 'free' && sec >= 120) {
        setMsg('warn', tr('recordTimerLimit', null, 'Reached 2-minute limit on Free plan — stopping.'));
        stopRecording();
      }
    }, 200);
  }

  function stopTimer() {
    clearInterval(state.tickHandle);
    state.tickHandle = null;
  }

  async function startRecording() {
    setMsg('muted', '');
    state.chunks = [];
    state.pendingAudio = null;
    state.pendingTranscript = '';
    if (state.previewUrl) { URL.revokeObjectURL(state.previewUrl); state.previewUrl = null; }
    preview.style.display = 'none';
    preview.src = '';
    refreshTranscriptPlaceholder(true);
    asrHint.textContent = '';
    updateSaveState();

    try {
      state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined;
      state.recorder = new MediaRecorder(state.mediaStream, mime ? { mimeType: mime } : undefined);

      state.recorder.ondataavailable = (e) => { if (e.data?.size) state.chunks.push(e.data); };
      state.recorder.onstop = () => {
        stopTimer();
        state.mediaStream.getTracks().forEach(t => t.stop());
        const blob = new Blob(state.chunks, { type: state.recorder.mimeType || 'audio/webm' });
        if (state.previewUrl) { URL.revokeObjectURL(state.previewUrl); }
        state.previewUrl = URL.createObjectURL(blob);
        preview.src = state.previewUrl;
        preview.style.display = 'block';
        micBtn.classList.remove('pulse');
        micBtn.setAttribute('aria-pressed', 'false');
        updateMicLabel();

        state.pendingAudio = blob;
        setMsg('muted', tr('recordRecordingReady', null, 'Recording ready. Review details, then press “Save story”.'));
        transcribeWithWhisper(blob);
        updateSaveState();

        state.chunks = [];
        state.recorder = null;
        state.mediaStream = null;
      };

      state.recorder.start(250);
      startTimer();
      micBtn.classList.add('pulse');
      micBtn.setAttribute('aria-pressed', 'true');
      updateMicLabel();
    } catch (e) {
      setMsg('warn', tr('recordMicrophoneError', { error: e.message || e }, 'Microphone error: ' + (e.message || e)));
    }
  }

  function stopRecording() {
    try { state.recorder?.state === 'recording' && state.recorder.stop(); } catch {}
  }

  // ---- Transcription --------------------------------------------------------
  async function transcribeWithWhisper(blob) {
    if (!blob) return;
    state.pendingTranscribing = true;
    updateSaveState();
    transcriptBox.textContent = tr('recordTranscribing', null, 'Transcribing with Whisper AI…');
    asrHint.textContent = tr('recordTranscribingHint', null, 'Please wait while we create your transcript.');
    try {
      const form = new FormData();
      form.append('audio', blob, 'recording.webm');
      form.append('language', getLang());
      const res = await fetch('/api/transcribe-chunk', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.detail || 'Transcription failed');
      const text = (data.partial || data.text || '').trim();
      if (text) {
        state.pendingTranscript = text;
        transcriptBox.textContent = text;
        asrHint.textContent = tr('recordTranscribeCompleteHint', null,
          'Transcribed automatically with Whisper AI. Edit before saving if needed.');
      } else {
        state.pendingTranscript = '';
        transcriptBox.textContent = tr('recordTranscribeNoSpeech', null, 'No speech detected.');
        asrHint.textContent = tr('recordTranscribeNoSpeechHint', null, 'Try recording again if this looks incorrect.');
      }
    } catch (err) {
      console.error(err);
      state.pendingTranscript = '';
      transcriptBox.textContent = tr('recordTranscribeError', null, 'Transcription unavailable.');
      asrHint.textContent = tr('recordTranscribeErrorHint', null, 'We could not reach Whisper AI. You can still save the audio.');
    } finally {
      state.pendingTranscribing = false;
      updateSaveState();
    }
  }

  // ---- Saving ---------------------------------------------------------------
  function sanitizeName(name) {
    return name ? name.replace(/[^a-z0-9\.]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() : 'upload';
  }

  async function saveStory() {
    if (saveBtn.disabled || state.isSaving) return;
    state.isSaving = true;
    const originalLabel = saveBtn.textContent;
    saveBtn.textContent = tr('recordSaveButtonSaving', null, 'Saving…');
    setMsg('muted', tr('recordSaving', null, 'Saving your story…'));

    try {
      const { data: userData } = await state.supa.auth.getUser();
      const user = userData?.user || null;
      if (!user) throw new Error(tr('recordSignInRequired', null, 'Please sign in again.'));

      const title = titleInput.value.trim() || tr('recordUntitled', null, 'Untitled');

      // 1) Insert minimal row to avoid schema cache errors (notes/when_text optional)
      const ins = await state.supa.from('stories')
        .insert({ title, visibility: 'private' })
        .select()
        .single();
      if (ins.error) throw ins.error;
      const story = ins.data;

      // 2) Update optional columns only if present
      const notesVal = notesInput.value.trim() || null;
      const whenVal  = whenInput.value.trim() || null;
      if (notesVal || whenVal) {
        await state.supa.from('stories')
          .update({ notes: notesVal, when_text: whenVal })
          .eq('id', story.id);
      }

      // 3) Upload audio if present
      if (state.pendingAudio) {
        setMsg('muted', tr('recordUploadingAudio', null, 'Uploading audio…'));
        const audioMime = state.pendingAudio.type || 'audio/webm';
        const audioPath = `user/${user.id}/audio/${crypto.randomUUID()}.webm`;
        const up = await state.supa.storage.from('story-media')
          .upload(audioPath, state.pendingAudio, { contentType: audioMime });
        if (up.error) throw up.error;
        const asset = await state.supa.from('story_assets')
          .insert({ story_id: story.id, kind: 'audio', path: audioPath, mime: audioMime })
          .select().single();
        if (asset.error) throw asset.error;
      }

      // 4) Upload photo if present
      const photoFile = photoInput.files?.[0];
      if (photoFile) {
        setMsg('muted', tr('recordUploadingPhoto', null, 'Uploading photo…'));
        const photoMime = photoFile.type || 'image/jpeg';
        const photoPath = `user/${user.id}/images/${crypto.randomUUID()}-${sanitizeName(photoFile.name)}`;
        const upImg = await state.supa.storage.from('story-media')
          .upload(photoPath, photoFile, { contentType: photoMime });
        if (upImg.error) throw upImg.error;
        const photoAsset = await state.supa.from('story_assets')
          .insert({ story_id: story.id, kind: 'image', path: photoPath, mime: photoMime })
          .select().single();
        if (photoAsset.error) throw photoAsset.error;
      }

      // 5) Upsert transcript if present
      const transcriptText = state.pendingTranscript || getTranscriptText();
      if (transcriptText) {
        await state.supa.from('story_texts')
          .upsert(
            { story_id: story.id, original_text: transcriptText, rewritten_text: null },
            { onConflict: 'story_id' }
          );
      }

      setMsg('ok', tr('recordSaveSuccess', null, 'Story saved! <a href="/stories.html">Go to My Stories</a>'));

      // Reset form bits
      state.pendingAudio = null;
      state.pendingTranscript = '';
      if (state.previewUrl) { URL.revokeObjectURL(state.previewUrl); state.previewUrl = null; }
      preview.style.display = 'none';
      preview.src = '';
      refreshTranscriptPlaceholder(true);
      asrHint.textContent = '';
      notesInput.value = '';
      titleInput.value = '';
      whenInput.value = '';
      photoInput.value = '';
      updateSaveState();
    } catch (e) {
      console.error(e);
      setMsg('warn', tr('recordSaveFailed', { error: e.message || e }, 'Save failed: ' + (e.message || e)));
    } finally {
      state.isSaving = false;
      saveBtn.textContent = originalLabel;
      updateSaveButtonLabel();
      updateSaveState();
    }
  }

  // ---- Public API for /js/record.js ----------------------------------------
  const API = {
    startRecording,
    stopRecording,
    updateMicLabel,
    updateSaveState,
    saveStory,
    refreshTranscriptPlaceholder,
    tr,
    getLang,
    initSession,    // fetch profile/plan + greet
    state           // expose state.plan, state.firstName if needed
  };
  window.MEMOIR_RECORD = API;

  // ---- Wire events on DOM ready --------------------------------------------
  document.addEventListener('DOMContentLoaded', async () => {
    cacheEls();
    await initSession();

    // Basic labels/placeholders on load
    refreshTranscriptPlaceholder(true);
    updateMicLabel();
    updateSaveButtonLabel();
    API.updateSaveState();

    // Buttons
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (API.state.recorder && API.state.recorder.state === 'recording') API.stopRecording();
        else API.startRecording();
      });
    }
    if (saveBtn) saveBtn.addEventListener('click', API.saveStory);
    if (notesInput) notesInput.addEventListener('input', API.updateSaveState);
    if (photoInput) photoInput.addEventListener('change', API.updateSaveState);

    // When language changes, re-apply labels/placeholders
    window.addEventListener('memoir:lang', () => {
      refreshTranscriptPlaceholder();
      updateMicLabel();
      updateSaveButtonLabel();
      updatePlanNote();
      updatePageTitle();
    });
  });
})();
