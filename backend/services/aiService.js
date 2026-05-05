const OpenAI = require('openai');

let aiClient = null;
let aiProvider = 'none';

// Initialize the appropriate client based on available API keys
if (process.env.TOGETHER_API_KEY) {
  aiClient = new OpenAI({
    apiKey: process.env.TOGETHER_API_KEY,
    baseURL: 'https://api.together.xyz/v1',
  });
  aiProvider = 'together';
  console.log('AI Service initialized with Together AI');
} else if (process.env.OPENAI_API_KEY) {
  aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  aiProvider = 'openai';
  console.log('AI Service initialized with OpenAI');
} else {
  console.log('No AI API key found. AI features will fallback to basic rules or mock data.');
}

const getModelName = () => {
  // Use a reliable model for JSON responses
  return aiProvider === 'together' ? 'meta-llama/Llama-3-8b-chat-hf' : 'gpt-3.5-turbo';
};

const getCompletion = async (systemPrompt, userPrompt, jsonFormat = false) => {
  if (!aiClient) {
    return null;
  }

  try {
    const options = {
      model: getModelName(),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Low temperature for more deterministic analysis
    };

    if (jsonFormat && aiProvider === 'openai') {
      options.response_format = { type: 'json_object' };
    }
    // Together API might not perfectly support response_format={type: 'json_object'} for all models,
    // so we rely on the system prompt for it.

    const response = await aiClient.chat.completions.create(options);
    return response.choices[0].message.content;
  } catch (error) {
    console.error(`Error with ${aiProvider} API:`, error);
    return null;
  }
};

/**
 * AI Functions
 */

const analyzeBiasAndSentiment = async (title, description) => {
  const text = `${title} ${description}`;
  if (!text.trim()) {
    return {
      politicalBias: 'Moderate',
      politicalBiasScore: 50,
      emotionalBias: 'Neutral',
      emotionalBiasScore: 50
    };
  }

  const systemPrompt = `You are a news bias and sentiment analyzer. Analyze the following text and return a JSON object with EXACTLY these keys:
- "politicalBias": A string, one of ["High", "Moderate", "Low"]
- "politicalBiasScore": A number from 0 to 100 (where 0 represents extreme liberal, 100 represents extreme conservative, and 50 is perfectly neutral)
- "emotionalBias": A string, one of ["Positive", "Negative", "Neutral", "Hopeful", "Exciting", "Worrisome"]
- "emotionalBiasScore": A number from 0 to 100 (where 0 is extremely negative, 100 is extremely positive, and 50 is neutral)

Do not add any other keys or markdown formatting. Just return raw JSON.`;

  const userPrompt = `Text to analyze:\n\n${text}`;

  const result = await getCompletion(systemPrompt, userPrompt, true);
  
  if (result) {
    try {
      // Clean up markdown block if present (sometimes models wrap JSON in \`\`\`json ... \`\`\`)
      let cleanedResult = result.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanedResult);
      return {
        politicalBias: parsed.politicalBias || 'Moderate',
        politicalBiasScore: typeof parsed.politicalBiasScore === 'number' ? parsed.politicalBiasScore : 50,
        emotionalBias: parsed.emotionalBias || 'Neutral',
        emotionalBiasScore: typeof parsed.emotionalBiasScore === 'number' ? parsed.emotionalBiasScore : 50
      };
    } catch (err) {
      console.error('Failed to parse AI bias analysis JSON', err, result);
    }
  }
  return null; // Fallback will be handled by the controller
};

const generateSummary = async (title, content) => {
  const systemPrompt = `You are an expert news summarizer. Your task is to provide a comprehensive, unbiased summary of the provided article.
Return a JSON object with exactly these keys:
- "summary": A well-written, concise summary paragraph (3-4 sentences).
- "keyPoints": An array of 3 to 5 strings, each representing a key factual bullet point from the article.

Do not include any other markdown formatting outside of the JSON.`;

  const userPrompt = `Title: ${title}\n\nContent:\n${content}`;

  const result = await getCompletion(systemPrompt, userPrompt, true);

  if (result) {
    try {
      let cleanedResult = result.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanedResult);
      if (parsed.summary && Array.isArray(parsed.keyPoints)) {
        return parsed;
      }
    } catch (err) {
      console.error('Failed to parse AI summary JSON', err, result);
    }
  }
  return null;
};

const translateText = async (text, targetLanguage) => {
  const languageNames = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'hi': 'Hindi',
    'zh': 'Chinese (Simplified)',
    'ar': 'Arabic',
    'ja': 'Japanese',
    'ko': 'Korean',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ta': 'Tamil',
    'bn': 'Bengali',
    'mr': 'Marathi',
    'te': 'Telugu',
    'it': 'Italian',
    'nl': 'Dutch',
    'no': 'Norwegian',
    'sv': 'Swedish'
  };

  const targetLanguageName = languageNames[targetLanguage] || targetLanguage;

  const systemPrompt = `You are a professional translator. Translate the following text into ${targetLanguageName}. Keep the original meaning and tone intact. Only return the translated text without any quotes, explanations, or formatting.`;
  
  const userPrompt = text;

  const result = await getCompletion(systemPrompt, userPrompt, false);
  return result ? result.trim() : null;
};

module.exports = {
  isAvailable: () => !!aiClient,
  analyzeBiasAndSentiment,
  generateSummary,
  translateText
};
