const Article = require('../models/Article');
const mongoose = require('mongoose');
const axios = require('axios');
const { franc } = require('franc-min');
const aiService = require('../services/aiService');

// Map franc 3-letter ISO 639-3 codes → 2-letter ISO 639-1 codes used by NewsAPI / UI
const FRANC_TO_ISO2 = {
  eng: 'en', hin: 'hi', tam: 'ta', ben: 'bn', mar: 'mr',
  tel: 'te', kan: 'kn', mal: 'ml', pan: 'pa', urd: 'ur',
  spa: 'es', fra: 'fr', deu: 'de', zho: 'zh', ara: 'ar',
  jpn: 'ja', kor: 'ko', por: 'pt', rus: 'ru', ita: 'it',
  nld: 'nl', pol: 'pl', swe: 'sv', nor: 'no', dan: 'da',
};

/**
 * Detect the language of a piece of text.
 * Returns a 2-letter ISO 639-1 code, or 'en' as fallback.
 */
const detectLanguage = (text) => {
  if (!text || text.trim().length < 10) return 'en';
  const iso3 = franc(text, { minLength: 10 });
  return FRANC_TO_ISO2[iso3] || 'en';
};

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const articles = await Article.find().sort({ publishedAt: -1 });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
};

// Get articles by user
exports.getArticlesByUser = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { userId } = req.params;
    const articles = await Article.find({ userId }).sort({ publishedAt: -1 });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching user articles:', error);
    res.status(500).json({ error: 'Error fetching user articles' });
  }
};

// Save article
exports.saveArticle = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // Analyze bias for the article being saved
    const biasAnalysis = await analyzeBias(req.body.title, req.body.description);
    
    const articleData = {
      ...req.body,
      userId: req.body.userId || 'anonymous',
      publishedAt: new Date(),
      analysis: {
        politicalBias: biasAnalysis.politicalBias,
        politicalBiasScore: biasAnalysis.politicalBiasScore,
        emotionalBias: biasAnalysis.emotionalBias,
        emotionalBiasScore: biasAnalysis.emotionalBiasScore
      }
    };
    
    const article = new Article(articleData);
    await article.save();
    res.status(201).json({ message: 'Article saved successfully', article });
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ error: 'Error saving article' });
  }
};

// Delete saved article
exports.deleteArticle = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Error deleting article' });
  }
};

// Fetch news from external API
exports.fetchNews = async (req, res) => {
  const { query, category, language, pageSize = 20 } = req.query;
  
  try {
    // Check if we have API key
    if (!process.env.NEWSAPI_KEY) {
      // Return sample data (mix of languages for demo) if no API key
      const allSampleArticles = [
        {
          id: 1,
          title: "Revolutionary AI Technology Transforms Healthcare Industry",
          description: "A groundbreaking artificial intelligence system is making waves in the healthcare sector, enabling faster diagnoses, personalized treatment plans, and improved patient outcomes.",
          urlToImage: "https://i.pinimg.com/1200x/9a/14/b8/9a14b84bb2cc2f5405f4c3676a77aec6.jpg",
          url: "https://www.who.int/news-room/spotlight/artificial-intelligence",
          category: "Technology",
          publishedAt: "2024-01-24",
          politicalBias: "Moderate",
          emotionalBias: "Positive",
          language: 'en',
          saved: false
        },
        {
          id: 2,
          title: "वैश्विक जलवायु शिखर सम्मेलन में ऐतिहासिक समझौता हुआ",
          description: "विश्व के नेताओं ने जलवायु परिवर्तन से निपटने के लिए एक ऐतिहासिक समझौते पर हस्ताक्षर किए हैं जिससे कार्बन उत्सर्जन में भारी कमी आएगी।",
          urlToImage: "https://i.pinimg.com/736x/5b/a4/66/5ba46665fc9bdb09ff6546654cc75e4d.jpg",
          url: "https://unfccc.int/news/climate-summit",
          category: "Environment",
          publishedAt: "2024-01-23",
          politicalBias: "Low",
          emotionalBias: "Hopeful",
          language: 'hi',
          saved: false
        },
        {
          id: 3,
          title: "Economic Markets Are Now Showing Strong Recovery Signs",
          description: "Global financial markets are showing clear signs of recovery, with major stock indices rising, investor confidence improving, and economic indicators pointing toward sustained growth.",
          urlToImage: "https://i.pinimg.com/1200x/38/d4/d7/38d4d70886c8a2dd73f3e5f1497c8f73.jpg",
          url: "https://www.imf.org/en/News/Articles/2024/01/economic-recovery",
          category: "Business",
          publishedAt: "2024-01-22",
          politicalBias: "High",
          emotionalBias: "Optimistic",
          language: 'en',
          saved: false
        },
        {
          id: 4,
          title: "புதிய விண்வெளி ஆராய்ச்சி தொழில்நுட்பம் புரட்சி ஏற்படுத்துகிறது",
          description: "விண்வெளி ஆராய்ச்சியில் புதிய கண்டுபிடிப்புகள் மனித இனத்தின் எதிர்காலத்தை மாற்றும் என்று விஞ்ஞானிகள் தெரிவித்தனர்.",
          urlToImage: "https://i.pinimg.com/1200x/de/35/3c/de353c9f646c31592a03faf7ef15065c.jpg",
          url: "https://www.nasa.gov/news/space-exploration-breakthrough",
          category: "Science",
          publishedAt: "2024-01-21",
          politicalBias: "Moderate",
          emotionalBias: "Exciting",
          language: 'ta',
          saved: false
        },
        {
          id: 5,
          title: "সরকার নতুন রাজনৈতিক সংস্কার ঘোষণা করেছে",
          description: "সরকার স্বচ্ছতা বৃদ্ধি এবং গণতান্ত্রিক প্রক্রিয়ায় জনগণের অংশগ্রহণ বাড়াতে ব্যাপক রাজনৈতিক সংস্কারের ঘোষণা দিয়েছে।",
          urlToImage: "https://i.pinimg.com/1200x/9a/14/b8/9a14b84bb2cc2f5405f4c3676a77aec6.jpg",
          url: "https://www.bbc.com/news/world/political-reforms",
          category: "Politics",
          publishedAt: "2024-01-20",
          politicalBias: "High",
          emotionalBias: "Neutral",
          language: 'bn',
          saved: false
        },
        {
          id: 6,
          title: "World Leaders Meet for International Summit",
          description: "Global leaders gather for an unprecedented international summit to address pressing world issues and strengthen diplomatic relations.",
          urlToImage: "https://i.pinimg.com/736x/5b/a4/66/5ba46665fc9bdb09ff6546654cc75e4d.jpg",
          url: "https://www.reuters.com/world/international-summit",
          category: "World",
          publishedAt: "2024-01-19",
          politicalBias: "Low",
          emotionalBias: "Positive",
          language: 'en',
          saved: false
        },
        {
          id: 7,
          title: "मराठी उद्योग क्षेत्रात मोठी प्रगती",
          description: "महाराष्ट्रातील उद्योग क्षेत्रात नव्या तंत्रज्ञानाचा वापर करून मोठ्या प्रमाणावर रोजगार निर्मिती होत आहे.",
          urlToImage: "https://i.pinimg.com/1200x/38/d4/d7/38d4d70886c8a2dd73f3e5f1497c8f73.jpg",
          category: "Business",
          publishedAt: "2024-01-18",
          politicalBias: "Low",
          emotionalBias: "Positive",
          language: 'mr',
          saved: false
        },
        {
          id: 8,
          title: "తెలుగు రాష్ట్రంలో కొత్త సాంకేతిక విద్యా కేంద్రాలు",
          description: "ఆంధ్రప్రదేశ్ మరియు తెలంగాణలో కొత్త సాంకేతిక విద్యా కేంద్రాలు ప్రారంభమవుతున్నాయి, ఇవి యువతకు ఉద్యోగావకాశాలు కల్పిస్తాయి.",
          urlToImage: "https://i.pinimg.com/1200x/de/35/3c/de353c9f646c31592a03faf7ef15065c.jpg",
          category: "Technology",
          publishedAt: "2024-01-17",
          politicalBias: "Low",
          emotionalBias: "Hopeful",
          language: 'te',
          saved: false
        }
      ];

      // Filter by category if provided
      let filteredArticles = allSampleArticles;
      if (category && category !== 'all') {
        filteredArticles = allSampleArticles.filter(article => 
          article.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by search query if provided
      if (query) {
        filteredArticles = filteredArticles.filter(article =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Filter by language if provided (and not 'all')
      if (language && language !== 'all') {
        filteredArticles = filteredArticles.filter(article =>
          article.language === language
        );
      }

      // Analyze bias for each article
      const analyzedArticles = await Promise.all(filteredArticles.map(async article => {
        const biasAnalysis = await analyzeBias(article.title, article.description);
        return {
          ...article,
          politicalBias: biasAnalysis.politicalBias,
          emotionalBias: biasAnalysis.emotionalBias,
          politicalBiasScore: biasAnalysis.politicalBiasScore,
          emotionalBiasScore: biasAnalysis.emotionalBiasScore
        };
      }));

      res.json({
        articles: analyzedArticles,
        totalResults: analyzedArticles.length,
        status: 'ok'
      });
      return;
    }

    // If we have API key, use real NewsAPI
    // NewsAPI supports a limited set of language codes; pass through if valid
    const newsApiLanguages = ['ar','de','en','es','fr','he','it','nl','no','pt','ru','sv','ud','zh'];
    const params = {
      apiKey: process.env.NEWSAPI_KEY,
      pageSize: pageSize
    };

    // Only pass language to NewsAPI if it's a supported code, else fetch all and filter
    if (language && language !== 'all' && newsApiLanguages.includes(language)) {
      params.language = language;
    } else if (!language || language === 'all') {
      params.language = 'en';
    }
    // For Indian languages (hi, ta, bn, mr, te, kn, ml) — don't filter at API level,
    // detect language locally and filter after fetch

    if (category && category !== 'all') {
      params.category = category;
    }

    if (query) {
      params.q = query;
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', { params });
    
    const newsArticles = response.data.articles || [];
    
    // Transform + detect language for each article
    let articles = await Promise.all(newsArticles.map(async (article, index) => {
      const biasAnalysis = await analyzeBias(article.title, article.description);
      const detectedLang = detectLanguage(`${article.title || ''} ${article.description || ''}`);
      return {
        id: index + 1,
        title: article.title,
        description: article.description,
        urlToImage: article.urlToImage,
        url: article.url,
        source: article.source?.name || '',
        category: category || 'General',
        publishedAt: article.publishedAt,
        language: detectedLang,
        politicalBias: biasAnalysis.politicalBias,
        emotionalBias: biasAnalysis.emotionalBias,
        politicalBiasScore: biasAnalysis.politicalBiasScore,
        emotionalBiasScore: biasAnalysis.emotionalBiasScore,
        saved: false
      };
    }));

    // Post-fetch language filter for languages not natively supported by NewsAPI
    if (language && language !== 'all') {
      articles = articles.filter(a => a.language === language);
    }

    res.json({
      articles: articles,
      totalResults: articles.length,
      status: response.data.status
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Error fetching news' });
  }
};

// AI Bias Analysis Function
const analyzeBias = async (title, description) => {
  if (aiService.isAvailable()) {
    const aiAnalysis = await aiService.analyzeBiasAndSentiment(title, description || '');
    if (aiAnalysis) {
      return aiAnalysis;
    }
  }

  // Fallback keyword-based analysis
  const text = `${title} ${description}`.toLowerCase();
  
  // Political bias analysis
  let politicalBiasScore = 50; // Neutral starting point
  let politicalBias = 'Moderate';
  
  // Keywords that indicate political bias
  const conservativeKeywords = ['conservative', 'republican', 'trump', 'right-wing', 'traditional', 'patriot'];
  const liberalKeywords = ['liberal', 'democrat', 'progressive', 'left-wing', 'reform', 'equality'];
  const neutralKeywords = ['bipartisan', 'compromise', 'balanced', 'objective', 'factual'];
  
  // Count keyword occurrences
  let conservativeCount = 0;
  let liberalCount = 0;
  let neutralCount = 0;
  
  conservativeKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    conservativeCount += (text.match(regex) || []).length;
  });
  
  liberalKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    liberalCount += (text.match(regex) || []).length;
  });
  
  neutralKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    neutralCount += (text.match(regex) || []).length;
  });
  
  // Calculate political bias score
  if (conservativeCount > liberalCount) {
    politicalBiasScore = 70 + (conservativeCount * 5);
    politicalBias = 'High';
  } else if (liberalCount > conservativeCount) {
    politicalBiasScore = 30 - (liberalCount * 5);
    politicalBias = 'High';
  } else if (neutralCount > 0) {
    politicalBiasScore = 45 + (neutralCount * 2);
    politicalBias = 'Low';
  } else {
    politicalBiasScore = 50;
    politicalBias = 'Moderate';
  }
  
  // Emotional bias analysis
  let emotionalBiasScore = 50;
  let emotionalBias = 'Neutral';
  
  const positiveKeywords = ['positive', 'success', 'achievement', 'breakthrough', 'hope', 'optimistic', 'exciting'];
  const negativeKeywords = ['negative', 'failure', 'crisis', 'disaster', 'fear', 'pessimistic', 'worrisome'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    positiveCount += (text.match(regex) || []).length;
  });
  
  negativeKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    negativeCount += (text.match(regex) || []).length;
  });
  
  // Calculate emotional bias score
  if (positiveCount > negativeCount) {
    emotionalBiasScore = 60 + (positiveCount * 3);
    emotionalBias = 'Positive';
  } else if (negativeCount > positiveCount) {
    emotionalBiasScore = 40 - (negativeCount * 3);
    emotionalBias = 'Negative';
  } else {
    emotionalBiasScore = 50;
    emotionalBias = 'Neutral';
  }
  
  // Ensure scores are within bounds
  politicalBiasScore = Math.max(0, Math.min(100, politicalBiasScore));
  emotionalBiasScore = Math.max(0, Math.min(100, emotionalBiasScore));
  
  return {
    politicalBias,
    politicalBiasScore: Math.round(politicalBiasScore),
    emotionalBias,
    emotionalBiasScore: Math.round(emotionalBiasScore)
  };
};

// Get saved articles count
exports.getSavedArticlesCount = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { userId } = req.params;
    const count = await Article.countDocuments({ userId });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching saved articles count:', error);
    res.status(500).json({ error: 'Error fetching saved articles count' });
  }
};
