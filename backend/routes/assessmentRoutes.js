const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

// Assessment Submit කරන Endpoint එක
router.post('/', async (req, res) => {
  try {
    const { passwordHabits, phishingAwareness, use2FA } = req.body;

    // 1. Simple Risk Calculation Logic එකක් (Logic එක ඔයාට අවශ්‍ය විදියට වෙනස් කළ හැක)
    let score = 100;
    if (passwordHabits === 'weak') score -= 30;
    if (phishingAwareness === 'low') score -= 40;
    if (!use2FA) score -= 30;

    let level = 'Low';
    if (score < 50) level = 'High Risk';
    else if (score < 80) level = 'Medium Risk';

    // 2. MongoDB එකේ Save කිරීම
    const newAssessment = await Assessment.create({
      passwordHabits,
      phishingAwareness,
      use2FA,
      riskScore: score,
      riskLevel: level
    });

    // 3. Result එක Frontend එකට ආපසු යැවීම
    res.status(201).json({
      success: true,
      data: newAssessment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;