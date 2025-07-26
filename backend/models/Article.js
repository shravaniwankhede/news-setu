const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  source: String,
  publishedAt: Date,
  language: String,
  userId: String, // For future user authentication
});

module.exports = mongoose.model('Article', articleSchema);