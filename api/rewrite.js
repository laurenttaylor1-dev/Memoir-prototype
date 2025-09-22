// /api/rewrite.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });

    const {
      text,                 // free-text mode (your old flow)
      story_id,             // story mode (new flow)
      title,
      tone = 'warm, vivid, cohesive',
      language = 'en'
    } = req.body || {};

    // If free-text is provided, use "old" behavior and return the rewritten text
    if (text) {
      const system = `You are a memoir ghostwriter. Rewrite the user's raw transcript into a clear, engaging, cohesive first-person narrative suitable for a book. Keep factual content, remove filler words, organize into paragraphs. Tone: ${tone}. Language: ${language}. Title/context: ${title || ''}.`;
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.7,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: text }
          ]
        })
      });
      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(500).json({ error: 'OpenAI error', details: errText });
      }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || '';
      return res.status(200).json({ text: content, raw: data });
    }

    // Otherwise, story mode: fetch story from Supabase and save rewritten_text
    if (!story_id) return res.status(400).json({ error: 'Provide either text or story_id' });

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
    if (!SUPABASE_URL || !SERVICE_ROLE) return res.status(500).json({ error: 'Supabase env missing' });

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
    const { data: story, error: sErr } = await sb.from('stories').select('id,title,notes').eq('id', story_id).single();
    if (sErr || !story) return res.status(404).json({ error: 'Story not found' });

    // Pull original text from story_texts.original_text if present; fallback to story.notes
    let original = '';
    const { data: textRow } = await sb.from('story_texts').select('original_text, rewritten_text').eq('story_id', story_id).single();
    if (textRow?.original_text) original = textRow.original_text;
    if (!original && story.notes) original = story.notes;
    if (!original) original = 'This story has audio but no transcript yet. Please write a warm, concise family-style narrative using any notes or inferred context.';

    const system = `You are a memoir ghostwriter. Rewrite the user's raw transcript into a clear, engaging, cohesive first-person narrative suitable for a book. Keep factual content, remove filler words, organize into paragraphs. Tone: ${tone}. Language: ${language}. Title/context: ${title || story.title || ''}.`;
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: original }
        ]
      })
    });
    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(500).json({ error: 'OpenAI error', details: errText });
    }
    const data = await resp.json();
    const rewritten = data.choices?.[0]?.message?.content?.trim();
    if (!rewritten) return res.status(500).json({ error: 'No rewrite produced' });

    if (textRow) {
      await sb.from('story_texts').update({ rewritten_text: rewritten }).eq('story_id', story_id);
    } else {
      await sb.from('story_texts').insert({ story_id, original_text: null, rewritten_text: rewritten });
    }

    return res.status(200).json({ message: 'Rewrite saved' });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
