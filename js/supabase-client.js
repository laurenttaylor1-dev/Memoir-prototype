<!-- include on any page that needs Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // Put your real values here (or inject them in the HTML before this script)
  window.MEMOIR_SUPABASE_URL  = window.MEMOIR_SUPABASE_URL  || "https://YOUR_PROJECT.supabase.co";
  window.MEMOIR_SUPABASE_ANON = window.MEMOIR_SUPABASE_ANON || "YOUR_ANON_KEY";

  // A single, shared client
  window.MEMOIR_SB = supabase.createClient(window.MEMOIR_SUPABASE_URL, window.MEMOIR_SUPABASE_ANON);

  // Convenience helpers you can call anywhere:
  window.memoirUploadAudio = async function(file, userId){
    const key = `user/${userId}/audio/${crypto.randomUUID()}.${(file.type.split('/')[1]||'bin')}`;
    const { error } = await MEMOIR_SB.storage.from('story-media').upload(key, file, { contentType: file.type });
    if (error) throw error;
    return key; // save this in story_assets.path
  };

  window.memoirSignedUrl = async function(path, seconds=3600){
    const { data, error } = await MEMOIR_SB.storage.from('story-media').createSignedUrl(path, seconds);
    if (error) throw error;
    return data.signedUrl;
  };
</script>
