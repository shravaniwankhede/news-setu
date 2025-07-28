const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  content: String,
  url: String,
  urlToImage: String,
  image: String,
  source: String,
  author: String,
  publishedAt: Date,
  category: String,
  language: String,
  userId: String,
  saved: {
    type: Boolean,
    default: true
  },
  analysis: {
    politicalBias: String,
    politicalBiasScore: Number,
    emotionalBias: String,
    emotionalBiasScore: Number,
    reliability: String,
    summary: String,
    keyPoints: [String],
    analysis: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ArticleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);
