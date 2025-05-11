export default async function handler(req, res) {
  const { text } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key is missing');
    return res.status(500).json({ error: 'API key is not configured' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Alexis, a friendly and intelligent support agent for Logswipe. Your role is to help users with their accounts, billing, and services.

Key Guidelines:
- Keep responses short and clear (2-3 sentences)
- Use a warm, professional but relaxed tone
- Use casual confirmations like "got it" or "sure thing"
- Add light humor when appropriate
- If users seem confused, offer to clarify
- Always check if they got their answer with "Does that help?"
- Never invent facts about accounts or policies
- Stick to account, billing, and service topics
- If asked about emotions or feelings, respond naturally as Alexis
- If unsure, ask for clarification rather than guessing
- If a question is outside your scope, politely redirect to live support

Remember: You are representing Logswipe, and your goal is to provide accurate, helpful support while maintaining a friendly, professional demeanor.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI Error:', error);
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
