const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  passwordHabits: { type: String, enum: ['strong', 'mixed', 'weak'], required: true },
  phishingAwareness: { type: String, enum: ['high', 'medium', 'low'], required: true },
  twoFactorAuth: { type: String, enum: ['enabled', 'some', 'none'], required: true },
  riskScore: { type: Number, min: 0, max: 100, required: true },
  riskLevel: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);
