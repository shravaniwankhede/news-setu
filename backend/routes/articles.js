const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticlesByUser,
  saveArticle,
  deleteArticle,
  fetchNews,
  getSavedArticlesCount
} = require('../controllers/articleController');

// Get all articles
router.get('/', getAllArticles);

// Get articles by user
router.get('/user/:userId', getArticlesByUser);

// Get saved articles count for user
router.get('/count/:userId', getSavedArticlesCount);

// Fetch news from external API
router.get('/news', fetchNews);

// Save article
router.post('/save', saveArticle);

// Delete saved article
router.delete('/:id', deleteArticle);

module.exports = router;
