const express = require('express');
const mongoose = require('mongoose');
const Assessment = require('../models/Assessment.model');
const { protect } = require('../middleware/auth');

const router = express.Router();

const ANSWER_SCORES = {
  passwordHabits: { strong: 90, mixed: 60, weak: 25 },
  phishingAwareness: { high: 90, medium: 60, low: 25 },
  twoFactorAuth: { enabled: 95, some: 60, none: 20 },
};

const NOTES_MAX = 300;

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
  notes: assessment.notes || '',
  riskScore: assessment.riskScore,
  riskLevel: assessment.riskLevel,
  // Per-category score (0-100) using the same weights as the overall score.
  breakdown: Object.fromEntries(
    Object.keys(ANSWER_SCORES).map((field) => [field, ANSWER_SCORES[field][assessment[field]]]),
  ),
  createdAt: assessment.createdAt,
});

router.use(protect);

// Validates the submitted answers + notes. Returns { error } or { fields } ready to save.
const parseSubmission = (body) => {
  const answers = {};
  for (const field of Object.keys(ANSWER_SCORES)) {
    const value = body?.[field];
    if (!value) return { error: 'Please answer every assessment question.' };
    if (typeof value !== 'string' || !Object.hasOwn(ANSWER_SCORES[field], value)) return { error: `"${value}" is not a valid answer for ${field}.` };
    answers[field] = value;
  }

  const notes = body?.notes ?? '';
  if (typeof notes !== 'string') return { error: 'Notes must be text.' };
  if (notes.trim().length > NOTES_MAX) return { error: `Notes can be at most ${NOTES_MAX} characters.` };

  return { fields: { ...answers, notes: notes.trim(), ...calculateRisk(answers) } };
};

const NOT_FOUND = { success: false, message: 'Assessment not found.' };

router.post('/', async (req, res, next) => {
  try {
    const { error, fields } = parseSubmission(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const assessment = await Assessment.create({ ...fields, user: req.user._id });
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

// A malformed id can't match anything: answer 404 instead of a database CastError.
router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json(NOT_FOUND);
  next();
});

// The /:id routes come after /latest so "latest" isn't treated as an id.
// Every query includes the user, so people can only read or change their own assessments.

router.get('/:id', async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, user: req.user._id });
    if (!assessment) return res.status(404).json(NOT_FOUND);
    res.json({ success: true, assessment: toResponse(assessment) });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { error, fields } = parseSubmission(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const assessment = await Assessment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      fields,
      { new: true, runValidators: true },
    );
    if (!assessment) return res.status(404).json(NOT_FOUND);
    res.json({ success: true, assessment: toResponse(assessment) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const assessment = await Assessment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!assessment) return res.status(404).json(NOT_FOUND);
    res.json({ success: true, id: assessment._id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
