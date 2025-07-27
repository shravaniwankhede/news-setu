const express = require('express');
const router = express.Router();
const {
  analyzeArticle,
  generateSummary,
  getAnalytics,
  translateText,
  getBulkAnalysis
} = require('../controllers/analysisController');

// Analyze article for bias and sentiment
router.post('/analyze', analyzeArticle);

// Generate article summary
router.post('/summarize', generateSummary);

// Get analytics dashboard data
router.get('/analytics', getAnalytics);

// Translate text
router.post('/translate', translateText);

// Get bulk analysis for multiple articles
router.post('/bulk-analyze', getBulkAnalysis);

// Feedback endpoint (for future use)
router.post('/feedback', (req, res) => {
  console.log('Feedback received:', req.body);
  res.json({ message: 'Feedback recorded' });
});

module.exports = router;