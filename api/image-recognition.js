// Vercel Serverless Function for image recognition
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { image } = req.body;
    try {
        const response = await fetch(`${process.env.API_BASE}/v1/images/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image })
        });
        const data = await response.json();
        res.status(200).json({ description: data.description, audio: data.audio });
    } catch (error) {
        console.error('Error calling OpenAI image recognition:', error);
        res.status(500).json({ error: 'Failed to process image.' });
    }
};
