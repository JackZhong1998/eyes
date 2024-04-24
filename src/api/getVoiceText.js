import openai from '../../utils/openai';
import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      res.status(500).json({ message: 'Error parsing form' });
      return;
    }

    try {
      const audioFile = files.audio;
      const audioData = fs.readFileSync(audioFile.filepath);

      const response = await openai.createTranscription(
        audioData,
        'whisper-1'
      );
      const text = response.data.text;

      res.status(200).send(text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      res.status(500).json({ message: 'Error transcribing audio' });
    }
  });
}