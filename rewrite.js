export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });

    const { text, title, tone = 'warm, vivid, cohesive', language = 'en' } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Missing text' });

    const system = `You are a memoir ghostwriter. Rewrite the user's raw transcript into a clear, engaging, cohesive first-person narrative suitable for a book. Keep factual content, remove filler words, organize into paragraphs. Tone: ${tone}. Language: ${language}. Title/context: ${title || ''}.`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
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
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
