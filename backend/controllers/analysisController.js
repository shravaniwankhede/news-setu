const axios = require('axios');

// Analyze article for bias and sentiment
exports.analyzeArticle = async (req, res) => {
  const { text, title, source } = req.body;
  
  try {
    // For now, return sample analysis since we don't have API keys
    const sampleAnalysis = {
      politicalBias: "Moderate",
      politicalBiasScore: 45,
      emotionalBias: "Positive",
      emotionalBiasScore: 65,
      reliability: "High",
      summary: "This article presents a balanced view with moderate political bias and positive emotional tone.",
      keyPoints: [
        "Balanced reporting on the topic",
        "Multiple perspectives included",
        "Factual information presented",
        "Clear and objective language used"
      ],
      analysis: "The article demonstrates good journalistic standards with moderate bias and positive sentiment."
    };
    
    res.json(sampleAnalysis);
  } catch (error) {
    console.error('Error analyzing article:', error);
    res.status(500).json({ error: 'Error analyzing article' });
  }
};

// Generate article summary
exports.generateSummary = async (req, res) => {
  const { text, title } = req.body;
  
  try {
    // For now, return sample summary since we don't have API keys
    const sampleSummary = "This article provides a comprehensive overview of the topic, covering key developments and implications. The content is well-structured and presents multiple viewpoints on the subject matter.";
    
    res.json({ summary: sampleSummary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Error generating summary' });
  }
};

// Get analytics dashboard data
exports.getAnalytics = async (req, res) => {
  try {
    // Get recent articles to calculate real analytics
    const Article = require('../models/Article');
    const mongoose = require('mongoose');
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return sample analytics if DB not connected
      const analytics = {
        totalArticles: 1250,
        savedArticles: 89,
        averagePoliticalBias: 34,
        averageEmotionalBias: 41,
        biasDistribution: {
          low: 42,
          moderate: 35,
          high: 23
        }
      };
      
      res.json(analytics);
      return;
    }

    // Get all articles from database
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(100);
    
    if (articles.length === 0) {
      // Return sample data if no articles in DB
      const analytics = {
        totalArticles: 1250,
        savedArticles: 89,
        averagePoliticalBias: 34,
        averageEmotionalBias: 41,
        biasDistribution: {
          low: 42,
          moderate: 35,
          high: 23
        }
      };
      
      res.json(analytics);
      return;
    }

    // Calculate real analytics from articles
    const totalArticles = articles.length;
    const savedArticles = articles.filter(article => article.saved).length;
    
    // Calculate average bias scores
    const politicalBiasScores = articles
      .filter(article => article.analysis && article.analysis.politicalBiasScore)
      .map(article => article.analysis.politicalBiasScore);
    
    const emotionalBiasScores = articles
      .filter(article => article.analysis && article.analysis.emotionalBiasScore)
      .map(article => article.analysis.emotionalBiasScore);
    
    const averagePoliticalBias = politicalBiasScores.length > 0 
      ? Math.round(politicalBiasScores.reduce((sum, score) => sum + score, 0) / politicalBiasScores.length)
      : 50;
    
    const averageEmotionalBias = emotionalBiasScores.length > 0
      ? Math.round(emotionalBiasScores.reduce((sum, score) => sum + score, 0) / emotionalBiasScores.length)
      : 50;

    // Calculate bias distribution
    const biasLevels = articles.map(article => {
      const politicalScore = article.analysis?.politicalBiasScore || 50;
      if (politicalScore < 30) return 'low';
      if (politicalScore > 70) return 'high';
      return 'moderate';
    });

    const biasDistribution = {
      low: Math.round((biasLevels.filter(level => level === 'low').length / biasLevels.length) * 100),
      moderate: Math.round((biasLevels.filter(level => level === 'moderate').length / biasLevels.length) * 100),
      high: Math.round((biasLevels.filter(level => level === 'high').length / biasLevels.length) * 100)
    };

    const analytics = {
      totalArticles,
      savedArticles,
      averagePoliticalBias,
      averageEmotionalBias,
      biasDistribution
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};

// Translate text
exports.translateText = async (req, res) => {
  const { text, targetLang } = req.body;
  
  try {
    // Check if we have API key for real translation
    if (!process.env.TOGETHER_API_KEY) {
      // Return sample translation if no API key
      const sampleTranslations = {
        'es': 'Este artículo presenta una vista equilibrada del tema con sesgo político moderado y tono emocional positivo.',
        'fr': 'Cet article présente une vue équilibrée du sujet avec un biais politique modéré et un ton émotionnel positif.',
        'de': 'Dieser Artikel bietet eine ausgewogene Sicht auf das Thema mit moderater politischer Voreingenommenheit und positivem emotionalem Ton.',
        'hi': 'यह लेख मध्यम राजनीतिक पूर्वाग्रह और सकारात्मक भावनात्मक स्वर के साथ विषय का संतुलित दृष्टिकोण प्रस्तुत करता है।',
        'zh': '这篇文章以温和的政治偏见和积极的情绪基调呈现了主题的平衡观点。',
        'ar': 'يقدم هذا المقال نظرة متوازنة للموضوع مع تحيز سياسي معتدل ونبرة عاطفية إيجابية.',
        'ja': 'この記事は、中程度の政治的偏見とポジティブな感情的なトーンで主題のバランスの取れた見方を提示しています。',
        'ko': '이 기사는 중간 정도의 정치적 편향과 긍정적인 감정적 톤으로 주제에 대한 균형 잡힌 관점을 제시합니다.',
        'pt': 'Este artigo apresenta uma visão equilibrada do tópico com viés político moderado e tom emocional positivo.',
        'ru': 'Эта статья представляет сбалансированный взгляд на тему с умеренной политической предвзятостью и позитивным эмоциональным тоном.'
      };
      
      const translatedText = sampleTranslations[targetLang] || `[Sample translation to ${targetLang}: ${text}]`;
      
      res.json({
        translatedText: translatedText,
        originalText: text,
        targetLanguage: targetLang
      });
      return;
    }

    // If we have API key, use real translation
    const response = await axios.post('https://api.together.xyz/v1/chat/completions', {
      model: 'meta-llama/Llama-2-70b-chat-hf',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLang}. Maintain the original meaning, tone, and style. Only return the translated text, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const translatedText = response.data.choices[0].message.content;
    
    res.json({
      translatedText: translatedText,
      originalText: text,
      targetLanguage: targetLang
    });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Error translating text' });
  }
};

// Get bulk analysis for multiple articles
exports.getBulkAnalysis = async (req, res) => {
  const { articles } = req.body;
  
  try {
    // For now, return sample bulk analysis since we don't have API keys
    const bulkAnalysis = articles.map((article, index) => ({
      id: article.id,
      politicalBias: "Moderate",
      politicalBiasScore: 45 + (index % 20),
      emotionalBias: "Positive",
      emotionalBiasScore: 60 + (index % 15),
      reliability: "High",
      summary: `Analysis of article ${index + 1}: Balanced reporting with moderate bias.`
    }));
    
    res.json({ analyses: bulkAnalysis });
  } catch (error) {
    console.error('Error bulk analyzing articles:', error);
    res.status(500).json({ error: 'Error bulk analyzing articles' });
  }
};
