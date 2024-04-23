// Vercel Serverless Function for speech-to-text
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { audio } = req.body;
    try {
        const response = await fetch(`${process.env.API_BASE}/v1/audio/transcriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ audio })
        });
        const data = await response.json();
        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error('Error calling OpenAI speech-to-text:', error);
        res.status(500).json({ error: 'Failed to transcribe audio.' });
    }
};
