import openai from '../../utils/openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { text, image } = req.body;

    const response = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: text },
      ],
      image: image,
    });

    const generatedText = response.data.choices[0].message.content;

    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error('Error processing text and image:', error);
    res.status(500).json({ message: 'Error processing text and image' });
  }
}