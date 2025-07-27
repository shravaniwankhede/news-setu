const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  summary: String,
  bias: String,
  tone: String,
  fakeNews: String,
  savedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', ArticleSchema);
