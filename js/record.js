// /js/record.js
(function () {
  const $ = (id) => document.getElementById(id);

  const I18N = window.MEMOIR_I18N;
  const getLangCode = () => (I18N?.getLang?.() || localStorage.getItem('memoir.lang') || 'en');
  const tr = (key, vars, fallback='') =>
    I18N?.translate?.(key, vars, getLangCode()) ||
    I18N?.translate?.(key, vars, 'en') ||
    I18N?.t?.(key, getLangCode()) ||
    I18N?.t?.(key, 'en') || fallback;

  // elements
  const pageTitle = $('pageTitle');
  const planNote = $('planNote');
  const micBtn = $('mic');
  const timerEl = $('timer');
  const msgEl = $('recMsg');
  const preview = $('preview');
  const transcriptBox = $('transcript');
  const asrHint = $('asrHint');
  const photoInput = $('photo');
  const saveBtn = $('saveBtn');
  const titleInput = $('title');
  const whenInput = $('when');
  const notesInput = $('notes');
  const tabFree = $('tabFree');
  const tabGuided = $('tabGuided');
  const promptsWrap = $('prompts');
  const refreshPrompts = $('refreshPrompts');

  // state
  let currentPlan = 'free';
  let hasSession = false;
  let currentFirstName = '';
  let mediaStream = null;
  let recorder = null;
  let chunks = [];
  let startedAt = 0;
  let tickHandle = null;
  let pendingAudio = null;
  let pendingTranscript = '';
  let pendingTranscribing = false;
  let previewUrl = null;
  let transcriptPlaceholder = 'Your words will appear here…';
  let isSaving = false;

  const TOPIC_WORDS = {
    en:["Childhood","Family","School","Work","Love","War","Travel","Traditions","Holidays","Lessons","Advice","Turning-points"],
    fr:["Enfance","Famille","École","Travail","Amour","Guerre","Voyages","Traditions","Fêtes","Leçons","Conseils","Déclics"],
    es:["Infancia","Familia","Escuela","Trabajo","Amor","Guerra","Viajes","Tradiciones","Fiestas","Lecciones","Consejos","Momentos clave"],
    nl:["Jeugd","Familie","School","Werk","Liefde","Oorlog","Reizen","Tradities","Feestdagen","Lessen","Advies","Keerpunt"]
  };

  const firstName = (n) => (n||'').trim().split(/\s+/)[0] || '';
  const fmt = (sec) => { sec = Math.max(0, sec|0); const m = (sec/60)|0; const r = (sec%60); return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; };
  const getTranscriptText = () => {
    const text = (transcriptBox.textContent || '').trim();
    return (!text || text === transcriptPlaceholder) ? '' : text;
  };
  const hasStoryContent = () => !!pendingAudio || !!getTranscriptText() || !!notesInput.value.trim() || (photoInput.files && photoInput.files.length>0);

  function planLabel(code){ return tr(`planLabel_${code}`, null, code); }

  function updatePageTitle(){
    if (!pageTitle) return;
    if (currentFirstName){
      pageTitle.textContent = tr('recordGreeting', { name: currentFirstName }, tr('recordTitle', null, 'Record'));
    } else {
      pageTitle.textContent = tr('recordTitle', null, 'Record');
    }
  }

  function updatePlanNote(){
    if (!planNote) return;
    if (!hasSession){ planNote.textContent = ''; return; }
    if (currentPlan === 'free'){
      planNote.textContent = tr('recordPlanFreeNote', null, 'Free plan: recordings over 2 minutes are not allowed. Upgrade in Settings for higher limits.');
    } else {
      planNote.textContent = tr('recordPlanGeneric', { plan: planLabel(currentPlan) }, `Plan: ${currentPlan}`);
    }
  }

  function refreshTranscriptPlaceholder(force=false){
    const next = tr('recordTranscriptPlaceholder', null, 'Your words will appear here…');
    const currentText = (transcriptBox.textContent || '').trim();
    const hadPlaceholder = !pendingTranscript && (!currentText || currentText === transcriptPlaceholder);
    transcriptPlaceholder = next;
    if (force || hadPlaceholder){ transcriptBox.textContent = transcriptPlaceholder; }
  }

  function updateMicLabel(){
    if (recorder && recorder.state === 'recording'){
      micBtn.textContent = tr('recordMicStop', null, 'Stop');
    } else {
      micBtn.textContent = tr('recordMicStart', null, 'Record');
    }
  }

  function updateSaveButtonLabel(){
    if (!isSaving) saveBtn.textContent = tr('recordSaveButton', null, 'Save story');
  }

  function updateSaveState(){ saveBtn.disabled = pendingTranscribing || !hasStoryContent(); }

  function startTimer(){
    startedAt = Date.now();
    clearInterval(tickHandle);
    tickHandle = setInterval(()=>{
      const sec = ((Date.now()-startedAt)/1000)|0;
      timerEl.textContent = fmt(sec);
      if (currentPlan === 'free' && sec >= 120){
        msgEl.className = 'muted warn';
        msgEl.textContent = tr('recordTimerLimit', null, 'Reached 2-minute limit on Free plan — stopping.');
        stopRecording();
      }
    }, 200);
  }

  function stopTimer(){ clearInterval(tickHandle); tickHandle = null; }

  async function transcribeWithWhisper(blob){
    if (!blob) return;
    pendingTranscribing = true; updateSaveState();
    transcriptBox.textContent = tr('recordTranscribing', null, 'Transcribing with Whisper AI…');
    asrHint.textContent = tr('recordTranscribingHint', null, 'Please wait while we create your transcript.');
    try {
      const form = new FormData();
      form.append('audio', blob, 'recording.webm');
      form.append('language', getLangCode());
      const res = await fetch('/api/transcribe-chunk', { method:'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.detail || 'Transcription failed');
      const text = (data.partial || data.text || '').trim();
      if (text){
        pendingTranscript = text;
        transcriptBox.textContent = text;
        asrHint.textContent = tr('recordTranscribeCompleteHint', null, 'Transcribed automatically with Whisper AI. Edit before saving if needed.');
      } else {
        pendingTranscript = '';
        transcriptBox.textContent = tr('recordTranscribeNoSpeech', null, 'No speech detected.');
        asrHint.textContent = tr('recordTranscribeNoSpeechHint', null, 'Try recording again if this looks incorrect.');
      }
    } catch (err) {
      console.error(err);
      pendingTranscript = '';
      transcriptBox.textContent = tr('recordTranscribeError', null, 'Transcription unavailable.');
      asrHint.textContent = tr('recordTranscribeErrorHint', null, 'We could not reach Whisper AI. You can still save the audio.');
    } finally {
      pendingTranscribing = false; updateSaveState();
    }
  }

  async function startRecording(){
    msgEl.className = 'muted';
    msgEl.textContent = '';
    chunks = []; pendingAudio = null; pendingTranscript = '';
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    preview.style.display = 'none'; preview.src = '';
    refreshTranscriptPlaceholder(true); asrHint.textContent = '';
    updateSaveState();
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const prefer = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined;
      recorder = new MediaRecorder(mediaStream, prefer ? { mimeType: prefer } : undefined);

      recorder.ondataavailable = (e)=>{ if (e.data?.size) chunks.push(e.data); };
      recorder.onstop = ()=>{
        stopTimer();
        mediaStream.getTracks().forEach(t=>t.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        if (previewUrl) { URL.revokeObjectURL(previewUrl); }
        previewUrl = URL.createObjectURL(blob);
        preview.src = previewUrl; preview.style.display = 'block';
        micBtn.classList.remove('pulse'); micBtn.setAttribute('aria-pressed','false'); updateMicLabel();

        pendingAudio = blob;
        msgEl.className = 'muted';
        msgEl.textContent = tr('recordRecordingReady', null, 'Recording ready. Review details, then press “Save story”.');
        transcribeWithWhisper(blob);
        updateSaveState();
        chunks = []; recorder = null; mediaStream = null;
      };

      recorder.start(250);
      startTimer();
      micBtn.classList.add('pulse'); micBtn.setAttribute('aria-pressed','true'); updateMicLabel();
    } catch (e) {
      msgEl.className = 'muted warn';
      msgEl.textContent = tr('recordMicrophoneError', { error: e.message || e }, 'Microphone error: ' + (e.message || e));
    }
  }

  function stopRecording(){ try { recorder?.state === 'recording' && recorder.stop(); } catch {} }

  function sanitizeName(name){ return name ? name.replace(/[^a-z0-9\.]+/gi,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').toLowerCase() : 'upload'; }

  async function saveStory(){
    if (saveBtn.disabled) return;
    saveBtn.disabled = true; isSaving = true;
    const originalLabel = saveBtn.textContent;
    saveBtn.textContent = tr('recordSaveButtonSaving', null, 'Saving…');
    msgEl.className = 'muted';
    msgEl.textContent = tr('recordSaving', null, 'Saving your story…');

    try {
      const supa = await window.MEMOIR_AUTH.ensureClient();
      const { data } = await supa.auth.getUser();
      const user = data?.user || null;
      if (!user) throw new Error(tr('recordSignInRequired', null, 'Please sign in again.'));

      const title = titleInput.value.trim() || tr('recordUntitled', null, 'Untitled');
      const when  = whenInput.value.trim() || null;
      const notes = notesInput.value.trim() || null;

      const ins = await supa.from('stories')
        .insert({ title, when_text: when, notes, visibility: 'private' })
        .select()
        .single();
      if (ins.error) throw ins.error;
      const story = ins.data;

      if (pendingAudio){
        msgEl.textContent = tr('recordUploadingAudio', null, 'Uploading audio…');
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

      const photoFile = photoInput.files?.[0];
      if (photoFile){
        msgEl.textContent = tr('recordUploadingPhoto', null, 'Uploading photo…');
        const photoMime = photoFile.type || 'image/jpeg';
        const photoPath = `user/${user.id}/images/${crypto.randomUUID()}-${sanitizeName(photoFile.name)}`;
        const upImg = await supa.storage.from('story-media').upload(photoPath, photoFile, { contentType: photoMime });
        if (upImg.error) throw upImg.error;
        const photoAsset = await supa.from('story_assets')
          .insert({ story_id: story.id, kind: 'image', path: photoPath, mime: photoMime })
          .select()
          .single();
        if (photoAsset.error) throw photoAsset.error;
      }

      const transcriptText = pendingTranscript || getTranscriptText();
      if (transcriptText){
        await supa.from('story_texts')
          .upsert({ story_id: story.id, original_text: transcriptText, rewritten_text: null }, { onConflict: 'story_id' })
          .select()
          .single()
          .catch(()=>{});
      }

      msgEl.className = 'ok';
      msgEl.innerHTML = tr('recordSaveSuccess', null, 'Story saved! <a href="/stories.html">Go to My Stories</a>');

      // reset UI
      pendingAudio = null; pendingTranscript = '';
      if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
      preview.style.display = 'none'; preview.src = '';
      refreshTranscriptPlaceholder(true); asrHint.textContent = '';
      notesInput.value = ''; titleInput.value = ''; whenInput.value = ''; photoInput.value = '';
    } catch (e) {
      console.error(e);
      msgEl.className = 'muted warn';
      msgEl.textContent = tr('recordSaveFailed', { error: e.message || e }, 'Save failed: ' + (e.message || e));
    } finally {
      isSaving = false;
      saveBtn.textContent = originalLabel;
      updateSaveButtonLabel(); updateSaveState();
    }
  }

  function renderPrompts(code){
    const words = TOPIC_WORDS[code] || TOPIC_WORDS.en;
    promptsWrap.innerHTML = '';
    [...words].sort(()=>Math.random()-0.5).slice(0,4).forEach(w => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = w;
      b.onclick = () => { titleInput.value = w; };
      promptsWrap.appendChild(b);
    });
  }

  function applyLang(code){
    renderPrompts(code);
    refreshTranscriptPlaceholder();
    updateMicLabel();
    updatePageTitle();
    updatePlanNote();
    updateSaveButtonLabel();
    notesInput.setAttribute('placeholder', tr('recordNotesPlaceholder', null, 'Add a quick note…'));
    titleInput.setAttribute('placeholder', tr('recordTitlePlaceholder', null, 'Story title'));
    whenInput.setAttribute('placeholder', tr('recordWhenPlaceholder', null, 'e.g. “summer 1945”, “early 2018”, “15 Feb 1972”'));
  }

  async function initSession(){
    try{
      const supa = await window.MEMOIR_AUTH.ensureClient();
      const { data } = await supa.auth.getUser();
      const user = data?.user || null;
      if (!user){
        hasSession = false; currentFirstName = ''; currentPlan = 'free';
        updatePageTitle(); updatePlanNote(); return;
      }
      hasSession = true;
      try {
        const { data: prof } = await supa.from('profiles')
          .select('full_name, subscription_plan')
          .eq('user_id', user.id)
          .single();
        if (prof?.full_name) currentFirstName = firstName(prof.full_name);
        currentPlan = prof?.subscription_plan || 'free';
      } catch { currentPlan = 'free'; }
      updatePageTitle(); updatePlanNote();
    }catch(e){
      // If the client cannot be created (e.g., CSP misconfig), show a friendly hint
      msgEl.className = 'muted warn';
      msgEl.textContent = tr('recordAuthUnavailable', null, 'Authentication unavailable on this page.');
    }
  }

  // wire up events
  function wireEvents(){
    tabFree.addEventListener('click', () => { tabFree.classList.add('active'); tabGuided.classList.remove('active'); });
    tabGuided.addEventListener('click', () => { tabGuided.classList.add('active'); tabFree.classList.remove('active'); });

    micBtn.addEventListener('click', () => {
      if (recorder && recorder.state === 'recording') stopRecording();
      else startRecording();
    });

    saveBtn.addEventListener('click', saveStory);
    notesInput.addEventListener('input', updateSaveState);
    photoInput.addEventListener('change', updateSaveState);
    refreshPrompts?.addEventListener('click', () => renderPrompts(getLangCode()));

    window.addEventListener('memoir:lang', (e) => applyLang(e.detail?.code || getLangCode()));
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getLangCode());
    updateSaveState();
    wireEvents();
    initSession();
  });
})();
