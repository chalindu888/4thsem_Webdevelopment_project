const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment'); // ඔබ සතුව ඇති Assessment Model එක මෙහි සම්බන්ධ වේ

// @route   GET /api/assessment (හෝ /api/assessments)
// @desc    සියලුම assessments ලබා ගැනීම
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find().sort({ createdAt: -1 });
    
    // ඩෑෂ්බෝඩ් එකට අවශ්‍ය format එකට ප්‍රතිචාර යැවීම
    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    console.error('Error fetching assessments:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error while fetching assessments',
      error: error.message 
    });
  }
});

// @route   POST /api/assessment (හෝ /api/assessments)
// @desc    අලුත් assessment එකක් සේව් කිරීම
router.post('/', async (req, res) => {
  try {
    const newAssessment = new Assessment(req.body);
    const savedAssessment = await newAssessment.save();

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: savedAssessment
    });
  } catch (error) {
    console.error('Error creating assessment:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error while creating assessment',
      error: error.message 
    });
  }
});

// @route   GET /api/assessment/:id
// @desc    නිශ්චිත ID එකක් ඇති assessment එකක් ලබා ගැනීම
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Error fetching assessment by ID:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;