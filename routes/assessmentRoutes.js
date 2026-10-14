const express = require('express');
const jwt = require('jsonwebtoken');
const Assessment = require('../models/Assessment');

const router = express.Router();

const calculateRisk = ({ passwordHabits, phishingAwareness, twoFactorAuth }) => {
  const values = {
    passwordHabits: { strong: 90, mixed: 60, weak: 25 },
    phishingAwareness: { high: 90, medium: 60, low: 25 },
    twoFactorAuth: { enabled: 95, some: 60, none: 20 },
  };
  const scores = [
    values.passwordHabits[passwordHabits],
    values.phishingAwareness[phishingAwareness],
    values.twoFactorAuth[twoFactorAuth],
  ];
  if (scores.some((value) => value === undefined)) return null;
  const score = Math.round(scores.reduce((total, value) => total + value, 0) / scores.length);
  return { riskScore: score, riskLevel: score < 40 ? 'HIGH RISK' : score < 70 ? 'MEDIUM RISK' : 'LOW RISK' };
};

router.post('/', async (req, res, next) => {
  try {
    const { passwordHabits, phishingAwareness, twoFactorAuth } = req.body;
    if (!passwordHabits || !phishingAwareness || !twoFactorAuth) return res.status(400).json({ message: 'All assessment answers are required.' });
    const result = calculateRisk(req.body);
    if (!result) return res.status(400).json({ message: 'Assessment contains an invalid answer.' });
    let userId;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        userId = jwt.verify(token, process.env.JWT_SECRET || 'secureai-development-secret').id;
      } catch {
        userId = undefined;
      }
    }
    const assessment = await Assessment.create({ ...req.body, ...result, user: userId });
    res.status(201).json({ id: assessment._id, ...result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
