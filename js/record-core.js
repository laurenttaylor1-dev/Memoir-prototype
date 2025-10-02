// /js/record-core.js
// Mic, timer, transcription, validation, storage uploads, DB writes.
// Designed to work with your current record.html and record.js (UI prompts).

(function () {
  // ---------- DOM ----------
  const titleInput     = document.getElementById('title');
  const whenInput      = document.getElementById('when');
  const notesInput     = document.getElementById('notes');
  const photoInput     = document.getElementById('photo');
  const saveBtn        = document.getElementById('saveBtn');
  const micBtn         = document.getElementById('mic');
  const timerEl        = document.getElementById('timer');
  const transcriptBox  = document.getElementById('transcript');
  const asrHint        = document.getElementById('asrHint');
  const msgEl          = document.getElementById('recMsg');
  const preview        = document.getElementById('preview');

  // ---------- i18n helpers ----------
  const I18N = window.MEMOIR_I18N || {};
  const getLang = () =>
    (I18N.getLang?.() || localStorage.getItem('memoir.lang') || 'en');
  const tr = (key, vars, fallback) =>
    I18N.translate?.(key, vars, getLang()) ??
    I18N.translate?.(key, vars, 'en') ??
    fallback ?? key;

  const PLACEHOLDER = tr('recordTranscriptPlaceholder', null, 'Your words will appear here…');

  // ---------- Supabase client ----------
  let SB = null;
  async function ensureSupabase() {
    if (SB) return SB;

    if (typeof window.getSupabase === 'function') {
      SB = await window.getSupabase();
      return SB;
    }

    // fallback from meta/header
    const url  = window.MEMOIR_SUPABASE_URL  || document.querySelector('meta[name="supabase-url"]')?.content;
    const anon = window.MEMOIR_SUPABASE_ANON || document.querySelector('meta[name="supabase-anon"]')?.content;
    if (!url || !anon) throw new Error('Supabase configuration missing.');

    if (!window.supabase?.createClient) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    SB = window.supabase.createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return SB;
  }

  // ---------- state ----------
  let mediaStream = null;
  let recorder    = null;
  let chunks      = [];
  let startedAt   = 0;
  let tickHandle  = null;
  let pendingAudio = null;
  let pendingTranscript = '';
  let previewUrl = null;
  let isSaving = false;

  // ---------- helpers ----------
  function setMsg(kind, text) {
    if (!msgEl) return;
    msgEl.className = 'muted' + (kind === 'ok' ? ' ok' : kind === 'warn' ? ' warn' : '');
    msgEl.innerHTML = text;
  }
  const pad = (n) => String(n).padStart(2, '0');
  function fmt(sec) { sec = Math.max(0, sec|0); return `${pad((sec/60)|0)}:${pad(sec%60)}`; }

  function refreshPlaceholder(force=false) {
    const current = (transcriptBox?.textContent || '').trim();
    const had = !pendingTranscript && (!current || current === PLACEHOLDER);
    if (force || had) transcriptBox.textContent = PLACEHOLDER;
  }
  function getTranscriptText() {
    const t = (transcriptBox?.textContent || '').trim();
    return (!t || t === PLACEHOLDER) ? '' : t;
  }
  function updateMicLabel() {
    if (!micBtn) return;
    micBtn.textContent = (recorder && recorder.state === 'recording')
      ? tr('recordMicStop', null, 'Stop')
      : tr('recordMicStart', null, 'Record');
  }
  function disableSave(dis) { if (saveBtn) saveBtn.disabled = !!dis; }

  function updateSaveDisabled() {
    const mustHave = !!(titleInput?.value.trim() && whenInput?.value.trim());
    saveBtn && (saveBtn.disabled = !mustHave || isSaving);
  }

  // ---------- timer ----------
  function startTimer() {
    startedAt = Date.now();
    clearInterval(tickHandle);
    tickHandle = setInterval(() => {
      const sec = ((Date.now() - startedAt)/1000)|0;
      timerEl && (timerEl.textContent = fmt(sec));
    }, 200);
  }
  function stopTimer() {
    clearInterval(tickHandle);
    tickHandle = null;
  }

  // ---------- transcription ----------
  async function transcribeWithOpenAI(blob) {
    if (!blob) return;
    pendingTranscript = '';
    if (asrHint) asrHint.textContent = tr('recordTranscribingHint', null, 'Please wait while we create your transcript.');
    transcriptBox.textContent = tr('recordTranscribing', null, 'Transcribing with Whisper AI…');

    try {
      const fd = new FormData();
      fd.append('audio', blob, 'recording.webm');
      fd.append('language', getLang());
      const res = await fetch('/api/transcribe-chunk', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.detail || 'Transcription failed');

      const text = (data.partial || data.text || '').trim();
      if (text) {
        pendingTranscript = text;
        transcriptBox.textContent = text;
        if (asrHint) asrHint.textContent = tr('recordTranscribeCompleteHint', null,
          'Transcribed automatically with Whisper AI. Edit before saving if needed.');
      } else {
        transcriptBox.textContent = tr('recordTranscribeNoSpeech', null, 'No speech detected.');
        if (asrHint) asrHint.textContent = tr('recordTranscribeNoSpeechHint', null,
          'Try recording again if this looks incorrect.');
      }
    } catch (err) {
      console.error('[transcribe]', err);
      transcriptBox.textContent = tr('recordTranscribeError', null, 'Transcription unavailable.');
      if (asrHint) asrHint.textContent = tr('recordTranscribeErrorHint', null,
        'We could not reach Whisper AI. You can still save the audio.');
    }
  }

  // ---------- recording ----------
  async function startRecording() {
    setMsg('info', '');
    chunks = [];
    pendingAudio = null;
    pendingTranscript = '';
    if (previewUrl) { try { URL.revokeObjectURL(previewUrl); } catch {} previewUrl = null; }
    if (preview) { preview.style.display = 'none'; preview.src = ''; }
    refreshPlaceholder(true);
    asrHint && (asrHint.textContent = '');
    updateSaveDisabled();

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined;
      recorder = new MediaRecorder(mediaStream, mime ? { mimeType: mime } : undefined);

      recorder.ondataavailable = (e) => { if (e?.data?.size) chunks.push(e.data); };
      recorder.onstop = () => {
        stopTimer();
        mediaStream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });

        if (preview) {
          if (previewUrl) { try { URL.revokeObjectURL(previewUrl); } catch {} }
          previewUrl = URL.createObjectURL(blob);
          preview.src = previewUrl;
          preview.style.display = 'block';
        }

        micBtn?.classList.remove('pulse');
        micBtn?.setAttribute('aria-pressed', 'false');
        updateMicLabel();

        pendingAudio = blob;
        setMsg('info', tr('recordRecordingReady', null, 'Recording ready. Review details, then press “Save story”.'));

        // Let record.js (UI module) know a recording is ready (for any extra UI it wants)
        window.dispatchEvent(new CustomEvent('memoir:recording-ready', { detail: { blob } }));

        // Fire off transcription
        transcribeWithOpenAI(blob);
        updateSaveDisabled();

        chunks = [];
        recorder = null;
        mediaStream = null;
      };

      recorder.start(250);
      startTimer();
      micBtn?.classList.add('pulse');
      micBtn?.setAttribute('aria-pressed', 'true');
      updateMicLabel();
    } catch (e) {
      setMsg('warn', tr('recordMicrophoneError', { error: e.message || e }, 'Microphone error: ' + (e.message || e)));
    }
  }
  function stopRecording() {
    try { recorder?.state === 'recording' && recorder.stop(); } catch {}
  }

  // ---------- validation ----------
  function validateRequiredFields() {
    const title = titleInput?.value.trim();
    const when  = whenInput?.value.trim();
    if (!title || !when) {
      let m = '';
      if (!title && !when) {
        m = tr('recordMissingTitleWhen', null, 'Please enter a title and when this happened.');
        titleInput?.focus();
      } else if (!title) {
        m = tr('recordMissingTitle', null, 'Please enter a title.');
        titleInput?.focus();
      } else {
        m = tr('recordMissingWhen', null, 'Please enter when this happened (e.g. “summer 1945”).');
        whenInput?.focus();
      }
      setMsg('warn', m);
      return { ok: false };
    }
    return { ok: true, title, when, notes: (notesInput?.value || '').trim() };
  }

  // ---------- save ----------
  async function saveStory() {
    const v = validateRequiredFields();
    if (!v.ok) return;

    isSaving = true;
    updateSaveDisabled();
    const original = saveBtn?.textContent;
    if (saveBtn) saveBtn.textContent = tr('recordSaveButtonSaving', null, 'Saving…');
    setMsg('info', tr('recordSaving', null, 'Saving your story…'));

    try {
      const supa = await ensureSupabase();
      const { data: userData } = await supa.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error(tr('recordSignInRequired', null, 'Please sign in again.'));

      // 1) Insert base story
      const ins = await supa
        .from('stories')
        .insert({
          title: v.title,
          when_text: v.when,         // requires column (see SQL at the end)
          notes: v.notes || null,    // optional if you kept notes column
          visibility: 'private'
        })
        .select()
        .single();
      if (ins.error) throw ins.error;
      const story = ins.data;

      // 2) Audio
      if (pendingAudio) {
        setMsg('info', tr('recordUploadingAudio', null, 'Uploading audio…'));
        const audioMime = pendingAudio.type || 'audio/webm';
        const audioPath = `user/${user.id}/audio/${crypto.randomUUID()}.webm`;
        const up = await supa.storage.from('story-media').upload(audioPath, pendingAudio, { contentType: audioMime });
        if (up.error) throw up.error;
        const asset = await supa.from('story_assets')
          .insert({ story_id: story.id, kind: 'audio', path: audioPath, mime: audioMime })
          .select()
          .single();
        if (asset.error) throw asset.error;
      }

      // 3) Photo
      const photoFile = photoInput?.files?.[0];
      if (photoFile) {
        setMsg('info', tr('recordUploadingPhoto', null, 'Uploading photo…'));
        const photoMime = photoFile.type || 'image/jpeg';
        const safe = photoFile.name
          ? photoFile.name.replace(/[^a-z0-9\.]+/gi,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').toLowerCase()
          : 'photo.jpg';
        const photoPath = `user/${user.id}/images/${crypto.randomUUID()}-${safe}`;
        const upImg = await supa.storage.from('story-media').upload(photoPath, photoFile, { contentType: photoMime });
        if (upImg.error) throw upImg.error;
        const photoAsset = await supa.from('story_assets')
          .insert({ story_id: story.id, kind: 'image', path: photoPath, mime: photoMime })
          .select()
          .single();
        if (photoAsset.error) throw photoAsset.error;
      }

      // 4) Transcript
      const text = pendingTranscript || getTranscriptText();
      if (text) {
        await supa.from('story_texts')
          .upsert(
            { story_id: story.id, original_text: text, rewritten_text: null },
            { onConflict: 'story_id' }
          )
          .select()
          .single()
          .catch(() => {});
      }

      setMsg('ok', tr('recordSaveSuccess', null, 'Story saved! <a href="/stories.html">Go to My Stories</a>'));

      // reset form
      pendingAudio = null;
      pendingTranscript = '';
      if (preview && preview.src) { try { URL.revokeObjectURL(preview.src); } catch {} preview.src = ''; preview.style.display = 'none'; }
      titleInput && (titleInput.value = '');
      whenInput  && (whenInput.value = '');
      notesInput && (notesInput.value = '');
      photoInput && (photoInput.value = '');
      refreshPlaceholder(true);
    } catch (err) {
      console.error('[record] save failed', err);
      setMsg('warn', tr('recordSaveFailed', { error: err.message || err }, 'Save failed: ' + (err.message || err)));
    } finally {
      isSaving = false;
      if (saveBtn) saveBtn.textContent = original || tr('recordSaveButton', null, 'Save story');
      updateSaveDisabled();
    }
  }

  // ---------- expose a few bits so record.js can call them if needed ----------
  window.MEMOIR_RECORD = {
    refreshTranscriptPlaceholder: () => refreshPlaceholder(true),
    updateMicLabel,
  };

  // ---------- wire up ----------
  document.addEventListener('DOMContentLoaded', () => {
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (recorder && recorder.state === 'recording') stopRecording();
        else startRecording();
      });
      updateMicLabel();
    }

    if (saveBtn) saveBtn.addEventListener('click', saveStory);
    titleInput?.addEventListener('input', updateSaveDisabled);
    whenInput ?.addEventListener('input', updateSaveDisabled);
    updateSaveDisabled();

    refreshPlaceholder(true);
  });

  // Translate placeholder on language change
  window.addEventListener('memoir:lang', () => {
    refreshPlaceholder(true);
    updateMicLabel();
  });
})();
