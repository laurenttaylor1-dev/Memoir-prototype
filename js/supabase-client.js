<!-- /js/supabase-client.js -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  /**
   * IMPORTANT: Supply your actual project values in one (1) place only.
   *
   * Option A — set them here (hard-coded):
   *   window.MEMOIR_SUPABASE_URL  = "https://YOUR_PROJECT.supabase.co";
   *   window.MEMOIR_SUPABASE_ANON = "YOUR_ANON_KEY";
   *
   * Option B — set them in your header partial (/partials/header.html)
   *   before this file is included, e.g.:
   *     <script>window.MEMOIR_SUPABASE_URL="...";window.MEMOIR_SUPABASE_ANON="...";</script>
   * This file will pick up those globals if already set.
   */

  // Fallbacks (only used if header didn't set them)
  window.MEMOIR_SUPABASE_URL  = window.MEMOIR_SUPABASE_URL  || "https://fswxkujxusdozvmpyvzk.supabase.co";
  window.MEMOIR_SUPABASE_ANON = window.MEMOIR_SUPABASE_ANON || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzd3hrdWp4dXNkb3p2bXB5dnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTk3MTYsImV4cCI6MjA3MzY5NTcxNn0.kNodFgDXi32w456e475fXvBi9eehX50HX_hVVTDBtXI";

  if (!window.supabase) {
    console.error("[supabase-client] supabase-js failed to load");
  }

  // Create a single shared client for the app
  window.MEMOIR_SB = supabase.createClient(window.MEMOIR_SUPABASE_URL, window.MEMOIR_SUPABASE_ANON);

  /** Upload an audio file to the private bucket story-media under user/<uid>/audio/<uuid>.<ext> */
  window.memoirUploadAudio = async function(file, userId){
    if (!file) throw new Error("No file provided");
    const ext = (file.type.split('/')[1] || 'bin').toLowerCase();
    const key = `user/${userId}/audio/${crypto.randomUUID()}.${ext}`;
    const { error } = await MEMOIR_SB.storage.from('story-media').upload(key, file, { contentType: file.type });
    if (error) throw error;
    return key; // store this in public.story_assets.path
  };

  /** Get a temporary signed URL to a private file (default: 1 hour) */
  window.memoirSignedUrl = async function(path, seconds=3600){
    const { data, error } = await MEMOIR_SB.storage.from('story-media').createSignedUrl(path, seconds);
    if (error) throw error;
    return data?.signedUrl;
  };
</script>
