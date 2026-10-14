const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// 1. Get all items (සියලු දත්ත ලබා ගැනීම)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Create a new item (අලුත් දත්තයක් එකතු කිරීම)
router.post('/', async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const newItem = new Item({ title, description, price });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Delete an item (දත්තයක් ඉවත් කිරීම)
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;