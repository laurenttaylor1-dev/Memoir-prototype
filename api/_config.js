// api/_config.js

// ---------- Default values (fall back to these if env vars aren’t set) ----------
const DEFAULT_SUPABASE_URL = 'https://fswxkujxusdozvmpyvzk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImtXc3N0cXNoYmFzZSIsInJlZiI6ImZzd3hrdWp4dXNkb3p2bXB5dnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTk3MTYsImV4cCI6MjA3MzY5NTcxNn0.kNodFgDXi32w456e475fXvBi9eehX50HX_hVVTDBtXI';

const DEFAULT_OPENAI_KEY = 'replace_with_your_real_key'; // ⚠️ never commit your real key
const DEFAULT_TRANSCRIBE_MODEL = 'gpt-4o-mini-transcribe';

// ---------- Supabase helpers ----------
export function getSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  );
}

export function getSupabaseAnonKey() {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY
  );
}

// ---------- OpenAI helpers ----------
export function getOpenAiKey() {
  return (
    process.env.OPENAI_API_KEY ||
    process.env.OPENAI_KEY ||
    DEFAULT_OPENAI_KEY
  );
}

export function getTranscribeModel() {
  return (
    process.env.OPENAI_TRANSCRIBE_MODEL ||
    DEFAULT_TRANSCRIBE_MODEL
  );
}
