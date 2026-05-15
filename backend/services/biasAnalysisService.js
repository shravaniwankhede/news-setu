const aiService = require('./aiService');
const cacheService = require('./cacheService');
const { generateArticleHash } = require('../utils/hashArticle');
const mongoose = require('mongoose');

const GlobalLock = require('../models/GlobalLock');

/**
 * Expert-level service for bias analysis.
 * Handles deduplication, caching, global concurrency control, and fallback logic.
 */
class BiasAnalysisService {
  constructor() {
    this.maxGlobalConcurrency = 10; 
    this.slotsInitialized = false;
  }

  /**
   * Ensures the 10 global concurrency slots exist in the DB.
   */
  async _ensureSlots() {
    if (this.slotsInitialized || mongoose.connection.readyState !== 1) return;
    
    try {
      const ops = [];
      for (let i = 0; i < this.maxGlobalConcurrency; i++) {
        ops.push({
          updateOne: {
            filter: { slotId: `slot_${i}` },
            update: { $setOnInsert: { status: 'idle' } },
            upsert: true
          }
        });
      }
      await GlobalLock.bulkWrite(ops);
      this.slotsInitialized = true;
    } catch (err) {
      console.error('Failed to initialize concurrency slots', err);
    }
  }

  /**
   * Distributed concurrency control: waits for a global slot to open.
   */
  async _acquireGlobalSlot() {
    if (mongoose.connection.readyState !== 1) return true;
    await this._ensureSlots();

    const start = Date.now();
    const timeout = 30000; // 30s
    const leaseTime = 45000; // 45s lease (longer than AI timeout)

    while (Date.now() - start < timeout) {
      const now = new Date();
      const slot = await GlobalLock.findOneAndUpdate(
        { 
          $or: [
            { status: 'idle' },
            { expiresAt: { $lt: now } }
          ]
        },
        { 
          status: 'busy', 
          ownerId: cacheService.instanceId, 
          expiresAt: new Date(now.getTime() + leaseTime) 
        },
        { new: true }
      );

      if (slot) return slot.slotId;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return null; 
  }

  async _releaseGlobalSlot(slotId) {
    if (!slotId || mongoose.connection.readyState !== 1) return;
    try {
      await GlobalLock.updateOne(
        { slotId, ownerId: cacheService.instanceId },
        { status: 'idle', ownerId: null, expiresAt: null }
      );
    } catch (err) {
      console.error(`Failed to release slot ${slotId}`, err);
    }
  }

  /**
   * Analyzes a single article with distributed-safe cache logic.
   */
  async analyzeArticle(title, description) {
    const hash = generateArticleHash(title, description);

    // 1. Try Cache First
    const cached = await cacheService.getCachedBias(hash);
    if (cached) return this._formatResult(cached);

    // 2. Distributed Locking
    let lockStatus = await cacheService.acquireLock(hash);

    if (lockStatus === 'pending') {
      const waitedResult = await cacheService.waitForAnalysis(hash);
      if (waitedResult) return this._formatResult(waitedResult);
      
      // If wait timed out, try to take the lock (maybe the first worker crashed)
      lockStatus = await cacheService.acquireLock(hash);
    }

    if (lockStatus !== 'locked' && lockStatus !== 'exists') {
      // Someone else is STILL working on it or we can't get a lock
      // Return fallback without storing to avoid duplication
      return this._runFallbackAnalysis(title, description);
    }
    
    if (lockStatus === 'exists') {
      const result = await cacheService.getCachedBias(hash);
      return result ? this._formatResult(result) : this._runFallbackAnalysis(title, description);
    }

    // 3. Run Analysis with Global Concurrency Control
    const slotId = await this._acquireGlobalSlot();
    let analysisResult;
    
    try {
      if (slotId || mongoose.connection.readyState !== 1) {
        analysisResult = await this._runAnalysis(title, description);
      } else {
        analysisResult = { 
          ...this._runFallbackAnalysis(title, description),
          analysisSource: 'fallback'
        };
      }
    } catch (error) {
      console.error('Analysis Error:', error);
      analysisResult = { 
        ...this._runFallbackAnalysis(title, description),
        analysisSource: 'fallback'
      };
    } finally {
      if (typeof slotId === 'string') await this._releaseGlobalSlot(slotId);
    }

    // 4. Release Lock and Store Result
    // Use short TTL (1h) for fallback results so they can be upgraded to AI soon
    const ttl = analysisResult.analysisSource === 'fallback' ? 1 : 24;
    await cacheService.releaseLock(hash, analysisResult, ttl);

    return this._formatResult(analysisResult);
  }

  /**
   * Analyzes a batch of articles with hash deduplication and concurrency control.
   */
  async analyzeBatch(articles) {
    if (!articles || articles.length === 0) return [];

    // 1. Extract unique articles by hash to avoid processing duplicates in the same batch
    const uniqueMap = new Map();
    articles.forEach(article => {
      const hash = generateArticleHash(article.title, article.description || article.text || '');
      if (!uniqueMap.has(hash)) {
        uniqueMap.set(hash, article);
      }
    });

    const uniqueHashes = Array.from(uniqueMap.keys());
    
    // 2. Process unique articles (analyzeArticle handles the global queue internally)
    const uniqueResultsPromises = uniqueHashes.map(async (hash) => {
      const article = uniqueMap.get(hash);
      const result = await this.analyzeArticle(article.title, article.description || article.text || '');
      return { hash, result };
    });

    const uniqueResults = await Promise.all(uniqueResultsPromises);
    const resultsMap = new Map();
    uniqueResults.forEach(({ hash, result }) => resultsMap.set(hash, result));

    // 3. Map results back to the original article list
    return articles.map(article => {
      const hash = generateArticleHash(article.title, article.description || article.text || '');
      return {
        ...article,
        ...resultsMap.get(hash)
      };
    });
  }

  /**
   * Internal method to run the actual analysis logic.
   */
  async _runAnalysis(title, description) {
    let biasAnalysis = null;

    if (aiService.isAvailable()) {
      biasAnalysis = await aiService.analyzeBiasAndSentiment(title, description || '');
    }

    if (biasAnalysis) {
      return { ...biasAnalysis, analysisSource: 'ai' };
    }

    return { 
      ...this._runFallbackAnalysis(title, description),
      analysisSource: 'fallback' 
    };
  }

  /**
   * Expert fallback logic (ported from previous implementation but cleaner).
   */
  _runFallbackAnalysis(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    // Political bias logic
    let polScore = 50;
    const conservative = ['conservative', 'republican', 'trump', 'right-wing', 'patriot'];
    const liberal = ['liberal', 'democrat', 'progressive', 'left-wing', 'reform'];
    
    let cCount = 0, lCount = 0;
    conservative.forEach(k => cCount += (text.match(new RegExp(k, 'gi')) || []).length);
    liberal.forEach(k => lCount += (text.match(new RegExp(k, 'gi')) || []).length);

    if (cCount > lCount) polScore = 70 + (cCount * 2);
    else if (lCount > cCount) polScore = 30 - (lCount * 2);

    // Emotional bias logic
    let emoScore = 50;
    const positive = ['success', 'breakthrough', 'hope', 'excellent'];
    const negative = ['crisis', 'disaster', 'failure', 'worrisome'];
    
    let pCount = 0, nCount = 0;
    positive.forEach(k => pCount += (text.match(new RegExp(k, 'gi')) || []).length);
    negative.forEach(k => nCount += (text.match(new RegExp(k, 'gi')) || []).length);

    if (pCount > nCount) emoScore = 65;
    else if (nCount > pCount) emoScore = 35;

    return {
      politicalBias: polScore > 60 ? 'High' : (polScore < 40 ? 'High' : 'Moderate'),
      politicalBiasScore: Math.round(Math.max(0, Math.min(100, polScore))),
      emotionalBias: emoScore > 50 ? 'Positive' : (emoScore < 50 ? 'Negative' : 'Neutral'),
      emotionalBiasScore: Math.round(emoScore)
    };
  }

  _formatResult(data) {
    return {
      politicalBias: data.politicalBias,
      politicalBiasScore: data.politicalBiasScore,
      emotionalBias: data.emotionalBias,
      emotionalBiasScore: data.emotionalBiasScore,
      analysisSource: data.analysisSource || 'ai'
    };
  }
}

module.exports = new BiasAnalysisService();
