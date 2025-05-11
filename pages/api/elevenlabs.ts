export default async function handler(req, res) {
  const { text } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    console.error('ElevenLabs API key is missing');
    return res.status(500).json({ error: 'API key is not configured' });
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('TTS Error:', error);
      return res.status(response.status).json({ error });
    }

    const buffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    res.status(200).json({ url: audioUrl });
  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
} 