// Vercel Serverless Function for text-to-speech
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { text, voice_name } = req.body;
    try {
        const response = await fetch(`${process.env.API_BASE}/v1/audio/speech`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                model: "tts-1",
                voice: voice_name
            })
        });
        const data = await response.json();
        res.status(200).json({ audio: data.audio });
    } catch (error) {
        console.error('Error calling OpenAI text-to-speech:', error);
        res.status(500).json({ error: 'Failed to generate speech.' });
    }
};
