const express = require('express');
const axios = require('axios');
const Article = require('../models/Article');
const router = express.Router();

router.get('/', async (req, res) => {
  const { query, lang } = req.query;
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        q: query || 'news',
        apiKey: process.env.NEWSAPI_KEY,
        language: lang || 'en',
      },
    });
    const articles = response.data.articles.map((article, index) => ({
      id: `${article.publishedAt}-${index}`,
      title: article.title,
      content: article.description || 'No content available',
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
    res.json(articles);
  } catch (error) {
    console.error('NewsAPI error:', error);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

router.post('/save', async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json({ message: 'Article saved' });
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ error: 'Error saving article' });
  }
});

module.exports = router;