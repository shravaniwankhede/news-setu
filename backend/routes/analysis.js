const express = require('express');
const Together = require('@together-ai/together');
const router = express.Router();

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

router.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const response = await together.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages: [
        {
          role: 'system',
          content: `Translate the following text into ${targetLang} (e.g., 'es' for Spanish, 'fr' for French, 'de' for German, 'zh' for Chinese). Return only the translated text.`,
        },
        { role: 'user', content: text },
      ],
    });
    const translatedText = response.choices[0].message.content;
    res.json({ translatedText });
  } catch (error) {
    console.error('Together AI translation error:', error);
    res.status(500).json({ error: 'Translation error' });
  }
});

router.post('/summarize', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await together.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages: [
        {
          role: 'system',
          content: `
            Perform the following tasks on the provided text:
            1. Summarize the text in 2-3 sentences.
            2. Analyze the text for political bias (Left, Right, Neutral), emotional tone (Positive, Negative, Neutral), and fake news likelihood (Real, Possibly Fake, Fake). Provide a brief justification for each.
            Return the response in JSON format:
            {
              "summary": "...",
              "analysis": {
                "bias": "Left/Right/Neutral",
                "biasJustification": "...",
                "tone": "Positive/Negative/Neutral",
                "toneJustification": "...",
                "fakeNews": "Real/Possibly Fake/Fake",
                "fakeNewsJustification": "..."
              }
            }
          `,
        },
        { role: 'user', content: text },
      ],
    });
    const result = JSON.parse(response.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('Together AI analysis error:', error);
    res.status(500).json({ error: 'Analysis error' });
  }
});

router.post('/feedback', async (req, res) => {
  console.log('Feedback received:', req.body);
  res.json({ message: 'Feedback recorded' });
});

router.get('/analytics', async (req, res) => {
  res.json({
    bias: { Left: 10, Right: 15, Neutral: 25 },
    tone: { Positive: 20, Negative: 10, Neutral: 20 },
    fakeNews: { Real: 30, PossiblyFake: 15, Fake: 5 },
  });
});

module.exports = router;