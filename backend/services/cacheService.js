const mongoose = require('mongoose');
const BiasCache = require('../models/BiasCache');
const os = require('os');

/**
 * Service to handle bias analysis caching logic.
 */
class CacheService {
  constructor() {
    this.instanceId = `${os.hostname()}-${process.pid}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Checks if MongoDB is connected and ready for operations.
   */
  isReady() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Retrieves cached bias analysis for a given hash.
   * Only returns completed and non-expired results.
   */
  async getCachedBias(hash) {
    if (!this.isReady()) return null;

    try {
      return await BiasCache.findOne({ 
        hash, 
        status: 'completed',
        expiresAt: { $gt: new Date() } 
      });
    } catch (error) {
      console.error('Cache Lookup Error:', error);
      return null;
    }
  }

  /**
   * Distributed Lock: Claims an article for analysis.
   * Returns 'locked' if this instance successfully claimed it.
   */
  async acquireLock(hash) {
    if (!this.isReady()) return 'locked';

    try {
      const now = new Date();
      const lockTimeout = 30000; // 30 seconds

      // Atomic claim logic with ownership check
      const result = await BiasCache.findOneAndUpdate(
        { 
          hash,
          $or: [
            { status: { $exists: false } },
            { status: 'pending', lockedAt: { $lt: new Date(now - lockTimeout) } },
            { expiresAt: { $lt: now } }
          ]
        },
        {
          hash,
          status: 'pending',
          ownerId: this.instanceId,
          lockedAt: now,
          expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
        },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting === false || result.value?.ownerId === this.instanceId) {
        return 'locked';
      }

      const existing = await BiasCache.findOne({ hash });
      if (existing?.status === 'completed' && existing.expiresAt > now) return 'exists';
      
      return 'pending';
    } catch (error) {
      if (error.code === 11000) return 'pending';
      console.error('Lock Acquisition Error:', error);
      return 'locked';
    }
  }

  /**
   * Releases the lock and stores the result, only if we still own it.
   */
  async releaseLock(hash, biasData, ttlHours = 24) {
    if (!this.isReady()) return;

    try {
      // Security: only update if we are the current owner
      const result = await BiasCache.findOneAndUpdate(
        { 
          hash, 
          ownerId: this.instanceId,
          status: 'pending' 
        },
        {
          ...biasData,
          status: 'completed',
          ownerId: null,
          lockedAt: null,
          expiresAt: new Date(Date.now() + (ttlHours * 60 * 60 * 1000))
        }
      );
      
      if (!result) {
        console.warn(`[Cache] Failed to release lock for ${hash}. Lock might have timed out or been stolen.`);
      }
    } catch (error) {
      console.error('Lock Release Error:', error);
    }
  }

  /**
   * Polls the DB until a pending analysis is completed.
   */
  async waitForAnalysis(hash) {
    const start = Date.now();
    const timeout = 15000; // Max wait 15s
    const interval = 1000; // Check every 1s

    while (Date.now() - start < timeout) {
      const cached = await this.getCachedBias(hash);
      if (cached) return cached;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    return null;
  }
}

module.exports = new CacheService();
