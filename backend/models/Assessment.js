const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' },
  passwordHabits: { type: String, required: true },
  phishingAwareness: { type: String, required: true },
  use2FA: { type: Boolean, required: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);