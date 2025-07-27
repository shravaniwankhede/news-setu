const Article = require('../models/Article');
const mongoose = require('mongoose');
const axios = require('axios');

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
    const biasAnalysis = analyzeBias(req.body.title, req.body.description);
    
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
      // Return sample data if no API key
      const allSampleArticles = [
        {
          id: 1,
          title: "Revolutionary AI Technology Transforms Healthcare Industry",
          description: "A groundbreaking artificial intelligence system is making waves in the healthcare sector, enabling faster diagnoses, personalized treatment plans, and improved patient outcomes.",
          urlToImage: "https://i.pinimg.com/1200x/9a/14/b8/9a14b84bb2cc2f5405f4c3676a77aec6.jpg",
          category: "Technology",
          publishedAt: "2024-01-24",
          politicalBias: "Moderate",
          emotionalBias: "Positive",
          saved: false
        },
        {
          id: 2,
          title: "Global Climate Summit Reaches Historic Agreement",
          description: "In a landmark moment for global environmental policy, world leaders have come together at the Climate Summit to sign a historic agreement aimed at drastically reducing carbon emissions.",
          urlToImage: "https://i.pinimg.com/736x/5b/a4/66/5ba46665fc9bdb09ff6546654cc75e4d.jpg",
          category: "Environment",
          publishedAt: "2024-01-23",
          politicalBias: "Low",
          emotionalBias: "Hopeful",
          saved: false
        },
        {
          id: 3,
          title: "Economic Markets Are Now Showing Strong Recovery Signs",
          description: "Global financial markets are showing clear signs of recovery, with major stock indices rising, investor confidence improving, and economic indicators pointing toward sustained growth.",
          urlToImage: "https://i.pinimg.com/1200x/38/d4/d7/38d4d70886c8a2dd73f3e5f1497c8f73.jpg",
          category: "Business",
          publishedAt: "2024-01-22",
          politicalBias: "High",
          emotionalBias: "Optimistic",
          saved: false
        },
        {
          id: 4,
          title: "Breakthrough in Space Exploration Technology",
          description: "A major advancement in space exploration technology is set to revolutionize future missions, with new innovations enhancing spacecraft efficiency and deep-space communication.",
          urlToImage: "https://i.pinimg.com/1200x/de/35/3c/de353c9f646c31592a03faf7ef15065c.jpg",
          category: "Science",
          publishedAt: "2024-01-21",
          politicalBias: "Moderate",
          emotionalBias: "Exciting",
          saved: false
        },
        {
          id: 5,
          title: "New Political Reforms Announced by Government",
          description: "The government has announced comprehensive political reforms aimed at increasing transparency and public participation in the democratic process.",
          urlToImage: "https://i.pinimg.com/1200x/9a/14/b8/9a14b84bb2cc2f5405f4c3676a77aec6.jpg",
          category: "Politics",
          publishedAt: "2024-01-20",
          politicalBias: "High",
          emotionalBias: "Neutral",
          saved: false
        },
        {
          id: 6,
          title: "World Leaders Meet for International Summit",
          description: "Global leaders gather for an unprecedented international summit to address pressing world issues and strengthen diplomatic relations.",
          urlToImage: "https://i.pinimg.com/736x/5b/a4/66/5ba46665fc9bdb09ff6546654cc75e4d.jpg",
          category: "World",
          publishedAt: "2024-01-19",
          politicalBias: "Low",
          emotionalBias: "Positive",
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

      // Analyze bias for each article (simulated AI analysis)
      const analyzedArticles = filteredArticles.map(article => {
        const biasAnalysis = analyzeBias(article.title, article.description);
        return {
          ...article,
          politicalBias: biasAnalysis.politicalBias,
          emotionalBias: biasAnalysis.emotionalBias,
          politicalBiasScore: biasAnalysis.politicalBiasScore,
          emotionalBiasScore: biasAnalysis.emotionalBiasScore
        };
      });

      res.json({
        articles: analyzedArticles,
        totalResults: analyzedArticles.length,
        status: 'ok'
      });
      return;
    }

    // If we have API key, use real NewsAPI
    const params = {
      apiKey: process.env.NEWSAPI_KEY,
      country: 'us',
      language: language || 'en',
      pageSize: pageSize
    };

    if (category && category !== 'all') {
      params.category = category;
    }

    if (query) {
      params.q = query;
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', { params });
    
    // Transform the response and analyze bias for each article
    const articles = response.data.articles.map((article, index) => {
      const biasAnalysis = analyzeBias(article.title, article.description);
      return {
        id: index + 1,
        title: article.title,
        description: article.description,
        urlToImage: article.urlToImage,
        category: category || 'General',
        publishedAt: article.publishedAt,
        politicalBias: biasAnalysis.politicalBias,
        emotionalBias: biasAnalysis.emotionalBias,
        politicalBiasScore: biasAnalysis.politicalBiasScore,
        emotionalBiasScore: biasAnalysis.emotionalBiasScore,
        saved: false
      };
    });

    res.json({
      articles: articles,
      totalResults: response.data.totalResults,
      status: response.data.status
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Error fetching news' });
  }
};

// AI Bias Analysis Function
const analyzeBias = (title, description) => {
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
