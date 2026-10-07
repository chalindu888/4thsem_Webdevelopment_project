const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  passwordHabits: { type: String, required: true },
  phishingAwareness: { type: String, required: true },
  twoFactorAuth: { type: String, required: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);
