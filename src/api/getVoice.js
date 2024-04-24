import openai from '../../utils/openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const text = req.body;
    const response = await openai.createAudioTranscription(
      'whisper-1',
      text,
      'male',
      'zh',
      1
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error generating voice:', error);
    res.status(500).json({ message: 'Error generating voice' });
  }
}