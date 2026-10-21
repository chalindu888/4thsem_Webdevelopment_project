const express = require('express');
const Assessment = require('../models/Assessment.model');
const { protect } = require('../middleware/auth');

const router = express.Router();

const ANSWER_SCORES = {
  passwordHabits: { strong: 90, mixed: 60, weak: 25 },
  phishingAwareness: { high: 90, medium: 60, low: 25 },
  twoFactorAuth: { enabled: 95, some: 60, none: 20 },
};

const calculateRisk = (answers) => {
  const scores = Object.keys(ANSWER_SCORES).map((field) => ANSWER_SCORES[field][answers[field]]);
  const score = Math.round(scores.reduce((total, value) => total + value, 0) / scores.length);
  return { riskScore: score, riskLevel: score < 40 ? 'HIGH RISK' : score < 70 ? 'MEDIUM RISK' : 'LOW RISK' };
};

const toResponse = (assessment) => ({
  id: assessment._id,
  passwordHabits: assessment.passwordHabits,
  phishingAwareness: assessment.phishingAwareness,
  twoFactorAuth: assessment.twoFactorAuth,
  riskScore: assessment.riskScore,
  riskLevel: assessment.riskLevel,
  // Per-category score (0-100) using the same weights as the overall score.
  breakdown: Object.fromEntries(
    Object.keys(ANSWER_SCORES).map((field) => [field, ANSWER_SCORES[field][assessment[field]]]),
  ),
  createdAt: assessment.createdAt,
});

router.use(protect);

router.post('/', async (req, res, next) => {
  try {
    const answers = {};
    for (const field of Object.keys(ANSWER_SCORES)) {
      const value = req.body?.[field];
      if (!value) return res.status(400).json({ success: false, message: 'Please answer every assessment question.' });
      if (typeof value !== 'string' || !Object.hasOwn(ANSWER_SCORES[field], value)) return res.status(400).json({ success: false, message: `"${value}" is not a valid answer for ${field}.` });
      answers[field] = value;
    }

    const assessment = await Assessment.create({ ...answers, ...calculateRisk(answers), user: req.user._id });
    res.status(201).json({ success: true, assessment: toResponse(assessment) });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, assessments: assessments.map(toResponse) });
  } catch (error) {
    next(error);
  }
});

router.get('/latest', async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!assessment) return res.status(404).json({ success: false, message: 'You have not completed an assessment yet.' });
    res.json({ success: true, assessment: toResponse(assessment) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
