// /js/record.js
(function () {
  const I18N = window.MEMOIR_I18N;

  // --- DOM ---
  const pageTitle = document.getElementById('pageTitle');
  const micBtn = document.getElementById('mic');
  const timerEl = document.getElementById('timer');
  const notesInput = document.getElementById('notes');
  const titleInput = document.getElementById('title');
  const whenInput = document.getElementById('when');
  const transcriptBox = document.getElementById('transcript');
  const asrHint = document.getElementById('asrHint');
  const photoInput = document.getElementById('photo');
  const saveBtn = document.getElementById('saveBtn');
  const tabFree = document.getElementById('tabFree');
  const tabGuided = document.getElementById('tabGuided');
  const promptsWrap = document.getElementById('prompts');
  const refreshPrompts = document.getElementById('refreshPrompts');
  const planNote = document.getElementById('planNote');
  const msgEl = document.getElementById('recMsg');
  const preview = document.getElementById('preview');

  // --- State ---
  let supa = null;
  let user = null;
  let recorder = null;
  let mediaStream = null;
  let chunks = [];
  let startedAt = 0;
  let tick = null;
  let currentPlan = 'free';
  let firstName = '';
  let transcriptPlaceholder = 'Your words will appear here…';
  let pendingAudio = null;
  let pendingTranscript = '';
  let pendingTranscribing = false;
  let previewUrl = null;

  // --- i18n helpers ---
  const getLang = () => (I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');
  const tr = (k, v, fb='') =>
    I18N?.translate?.(k, v, getLang()) || I18N?.translate?.(k, v, 'en') || I18N?.t?.(k, getLang()) || I18N?.t?.(k, 'en') || fb;

  // --- Guided topics + TTS ---
  const TOPICS = {
    en: ['Childhood','Family','School','Work','Love','War','Travel','Traditions','Holidays','Lessons','Advice','Turning-points'],
    fr: ['Enfance','Famille','École','Travail','Amour','Guerre','Voyages','Traditions','Fêtes','Leçons','Conseils','Déclics'],
    es: ['Infancia','Familia','Escuela','Trabajo','Amor','Guerra','Viajes','Tradiciones','Fiestas','Lecciones','Consejos','Momentos clave'],
    nl: ['Jeugd','Familie','School','Werk','Liefde','Oorlog','Reizen','Tradities','Feestdagen','Lessen','Advies','Keerpunt']
  };

  function renderTopics() {
    const code = getLang();
    const words = [...(TOPICS[code] || TOPICS.en)].sort(()=>Math.random()-0.5).slice(0,6);
    promptsWrap.innerHTML = '';
    words.forEach(w => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = w;
      b.addEventListener('click', async () => {
        try { await speak(`Let's talk about ${w}. Share a moment that matters.`); } catch {}
        titleInput.value = w;
      });
      promptsWrap.appendChild(b);
    });
  }

  async function speak(text) {
    // must be called from a user gesture for autoplay policies
    const r = await fetch('/api/voice?text=' + encodeURIComponent(text));
    if (!r.ok) throw new Error('TTS failed');
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = new Audio(url);
    await a.play().catch(()=>{ /* if blocked, you can show a "tap to play" hint */ });
  }

  // --- UI helpers ---
  function updateTitle() {
    pageTitle.textContent = firstName
      ? tr('recordGreeting', { name: firstName }, 'Record')
      : tr('recordTitle', null, 'Record');
  }
  function updatePlanNote() {
    if (!user) { planNote.textContent = ''; return; }
    if (currentPlan === 'free') {
      planNote.textContent = tr('recordPlanFreeNote', null, 'Free plan…');
    } else {
      planNote.textContent = tr('recordPlanGeneric', { plan: currentPlan }, 'Plan: ' + currentPlan);
    }
  }
  function refreshTranscriptPlaceholder(force=false) {
    const next = tr('recordTranscriptPlaceholder', null, 'Your words will appear here…');
    const cur  = (transcriptBox.textContent || '').trim();
    const wasPlaceholder = !pendingTranscript && (!cur || cur === transcriptPlaceholder);
    transcriptPlaceholder = next;
    if (force || wasPlaceholder) transcriptBox.textContent = transcriptPlaceholder;
  }
  function updateMicLabel() {
    micBtn.textContent = (recorder && recorder.state === 'recording')
      ? tr('recordMicStop', null, 'Stop')
      : tr('recordMicStart', null, 'Record');
  }
  function hasStoryContent() {
    return !!pendingAudio || !!(transcriptBox.textContent && transcriptBox.textContent.trim() && transcriptBox.textContent.trim() !== transcriptPlaceholder) || !!notesInput.value.trim() || (photoInput.files && photoInput.files.length);
  }
  function updateSaveState() {
    saveBtn.disabled = pendingTranscribing || !hasStoryContent();
  }
  function fmt(sec){ sec = Math.max(0, sec|0); const m = (sec/60)|0; const r = (sec%60); return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; }

  function startTimer() {
    startedAt = Date.now();
    clearInterval(tick);
    tick = setInterval(()=>{
      const s = ((Date.now()-startedAt)/1000)|0;
      timerEl.textContent = fmt(s);
      if (currentPlan === 'free' && s >= 120) {
        msgEl.className = 'muted warn';
        msgEl.textContent = tr('recordTimerLimit', null, 'Reached limit');
        stopRecording();
      }
    }, 200);
  }
  function stopTimer() { clearInterval(tick); tick=null; }

  // --- ASR (Whisper via /api/transcribe-chunk) ---
  async function transcribeWithWhisper(blob){
    if (!blob) return;
    pendingTranscribing = true;
    updateSaveState();
    transcriptBox.textContent = tr('recordTranscribing', null, 'Transcribing…');
    asrHint.textContent = tr('recordTranscribingHint', null, 'Please wait…');
    try {
      const fd = new FormData();
      fd.append('audio', blob, 'recording.webm');
      fd.append('language', getLang());
      const r = await fetch('/api/transcribe-chunk', { method:'POST', body: fd });
      const data = await r.json().catch(()=> ({}));
      if (!r.ok) throw new Error(data?.detail || data?.error || 'ASR error');

      const text = (data.partial || data.text || '').trim();
      if (text) {
        pendingTranscript = text;
        transcriptBox.textContent = text;
        asrHint.textContent = tr('recordTranscribeCompleteHint', null, 'Transcribed.');
      } else {
        pendingTranscript = '';
        transcriptBox.textContent = tr('recordTranscribeNoSpeech', null, 'No speech detected.');
        asrHint.textContent = tr('recordTranscribeNoSpeechHint', null, 'Try again.');
      }
    } catch (e) {
      pendingTranscript = '';
      transcriptBox.textContent = tr('recordTranscribeError', null, 'Transcription unavailable.');
      asrHint.textContent = tr('recordTranscribeErrorHint', null, 'We could not reach Whisper.');
    } finally {
      pendingTranscribing = false;
      updateSaveState();
    }
  }

  // --- Recording ---
  async function startRecording(){
    msgEl.className = 'muted';
    msgEl.textContent = '';
    chunks = [];
    pendingAudio = null;
    pendingTranscript = '';
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    preview.src = '';
    preview.style.display = 'none';
    refreshTranscriptPlaceholder(true);
    asrHint.textContent = '';
    updateSaveState();

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? { mimeType:'audio/webm' } : undefined;
      recorder = new MediaRecorder(mediaStream, mime);
      recorder.ondataavailable = (e)=>{ if (e.data?.size) chunks.push(e.data); };
      recorder.onstop = ()=>{
        stopTimer();
        try { mediaStream.getTracks().forEach(t=>t.stop()); } catch {}
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        previewUrl = URL.createObjectURL(blob);
        preview.src = previewUrl;
        preview.style.display = 'block';
        micBtn.classList.remove('pulse');
        micBtn.setAttribute('aria-pressed','false');
        updateMicLabel();

        pendingAudio = blob;
        msgEl.textContent = tr('recordRecordingReady', null, 'Recording ready…');
        transcribeWithWhisper(blob);
        updateSaveState();
        chunks = []; recorder = null; mediaStream = null;
      };
      recorder.start(250);
      startTimer();
      micBtn.classList.add('pulse');
      micBtn.setAttribute('aria-pressed','true');
      updateMicLabel();
    } catch (e) {
      msgEl.className = 'muted warn';
      msgEl.textContent = tr('recordMicrophoneError', { error: e.message || e }, 'Mic error');
    }
  }
  function stopRecording(){ try { if (recorder && recorder.state === 'recording') recorder.stop(); } catch {} }

  // --- Save story (safe even if your DB doesn’t have notes/when_text) ---
  async function saveStory(){
    if (saveBtn.disabled) return;
    saveBtn.disabled = true;
    const orig = saveBtn.textContent;
    saveBtn.textContent = tr('recordSaveButtonSaving', null, 'Saving…');
    msgEl.textContent = tr('recordSaving', null, 'Saving…');

    try {
      const { data } = await supa.auth.getUser();
      user = data?.user || null;
      if (!user) throw new Error(tr('recordSignInRequired', null, 'Please sign in again.'));

      const title = titleInput.value.trim() || tr('recordUntitled', null, 'Untitled');

      const ins = await supa.from('stories').insert({ title, visibility: 'private' }).select().single();
      if (ins.error) throw ins.error;
      const story = ins.data;

      // Optional fields (only if you re-added those columns)
      try {
        const notesVal = notesInput.value.trim() || null;
        const whenVal  = whenInput.value.trim()  || null;
        if (notesVal || whenVal) {
          await supa.from('stories').update({ notes: notesVal, when_text: whenVal }).eq('id', story.id);
        }
      } catch { /* ignore if columns don't exist */ }

      if (pendingAudio) {
        msgEl.textContent = tr('recordUploadingAudio', null, 'Uploading audio…');
        const audioMime = pendingAudio.type || 'audio/webm';
        const audioPath = `user/${user.id}/audio/${crypto.randomUUID()}.webm`;
        const up = await supa.storage.from('story-media').upload(audioPath, pendingAudio, { contentType: audioMime });
        if (up.error) throw up.error;
        await supa.from('story_assets').insert({ story_id: story.id, kind: 'audio', path: audioPath, mime: audioMime });
      }

      const photo = photoInput.files?.[0];
      if (photo) {
        msgEl.textContent = tr('recordUploadingPhoto', null, 'Uploading photo…');
        const photoPath = `user/${user.id}/images/${crypto.randomUUID()}-${(photo.name||'photo').replace(/\s+/g,'-')}`;
        const up = await supa.storage.from('story-media').upload(photoPath, photo, { contentType: photo.type || 'image/jpeg' });
        if (up.error) throw up.error;
        await supa.from('story_assets').insert({ story_id: story.id, kind: 'image', path: photoPath, mime: photo.type || 'image/jpeg' });
      }

      const t = (pendingTranscript || '').trim();
      if (t) {
        await supa.from('story_texts').upsert({ story_id: story.id, original_text: t, rewritten_text: null }, { onConflict: 'story_id' });
      }

      msgEl.className = 'ok';
      msgEl.innerHTML = tr('recordSaveSuccess', null, 'Story saved! <a href="/stories.html">Go to My Stories</a>');

      // reset
      pendingAudio = null; pendingTranscript = '';
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = null; preview.src = ''; preview.style.display = 'none';
      notesInput.value = ''; whenInput.value = ''; titleInput.value = ''; photoInput.value = '';
      refreshTranscriptPlaceholder(true);
      asrHint.textContent = '';
      updateSaveState();
    } catch (e) {
      msgEl.className = 'muted warn';
      msgEl.textContent = tr('recordSaveFailed', { error: e.message || e }, 'Save failed');
    } finally {
      saveBtn.textContent = orig;
      saveBtn.disabled = false;
    }
  }

  // --- Init ---
  async function init() {
    // Get shared Supabase client (reads meta tags, loads SDK, sets globals)
    supa = await window.MEMOIR_AUTH.ensureClient();

    // personalize + plan
    const { data } = await supa.auth.getUser();
    user = data?.user || null;
    if (user) {
      try {
        const p = await supa.from('profiles').select('full_name, subscription_plan').eq('user_id', user.id).single();
        firstName = (p.data?.full_name || '').trim().split(/\s+/)[0] || '';
        currentPlan = p.data?.subscription_plan || 'free';
      } catch { currentPlan = 'free'; }
    } else {
      firstName = ''; currentPlan = 'free';
    }
    updateTitle();
    updatePlanNote();
    refreshTranscriptPlaceholder(true);
    renderTopics();
  }

  // --- Wire events ---
  tabFree.addEventListener('click', () => {
    tabFree.classList.add('active'); tabGuided.classList.remove('active');
  });
  tabGuided.addEventListener('click', () => {
    tabGuided.classList.add('active'); tabFree.classList.remove('active');
    renderTopics();
  });
  refreshPrompts.addEventListener('click', renderTopics);

  micBtn.addEventListener('click', () => {
    if (recorder && recorder.state === 'recording') stopRecording(); else startRecording();
  });
  saveBtn.addEventListener('click', saveStory);
  notesInput.addEventListener('input', updateSaveState);
  photoInput.addEventListener('change', updateSaveState);
  window.addEventListener('memoir:lang', () => { updateTitle(); updatePlanNote(); refreshTranscriptPlaceholder(); renderTopics(); updateMicLabel(); });

  // kick off
  init().catch(err => console.error('[record] init failed', err));
})();
