const mongoose = require('mongoose');

const biasCacheSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'completed',
    index: true,
  },
  lockedAt: {
    type: Date,
  },
  ownerId: {
    type: String,
    index: true,
  },
  analysisSource: {
    type: String,
    enum: ['ai', 'fallback'],
    default: 'ai',
  },
  politicalBias: {
    type: String,
    required: false, // Optional because it might be pending
  },
  politicalBiasScore: {
    type: Number,
    required: false,
  },
  emotionalBias: {
    type: String,
    required: false,
  },
  emotionalBiasScore: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index: documents expire when current date > expiresAt
  },
});

module.exports = mongoose.model('BiasCache', biasCacheSchema);
