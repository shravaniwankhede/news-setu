const mongoose = require('mongoose');

const globalLockSchema = new mongoose.Schema({
  slotId: { type: String, unique: true, required: true },
  status: { type: String, enum: ['idle', 'busy'], default: 'idle' },
  ownerId: { type: String },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('GlobalLock', globalLockSchema);
