const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 1. Get all items
router.get('/', async (req, res, next) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// 2. Create a new item (requires login so anonymous visitors can't write data)
router.post('/', protect, async (req, res, next) => {
  const { title, description, price } = req.body || {};
  try {
    const savedItem = await Item.create({ title, description, price });
    res.status(201).json(savedItem);
  } catch (error) {
    next(error);
  }
});

// 3. Delete an item (requires login)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
