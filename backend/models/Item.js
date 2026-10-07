const mongoose = require('mongoose');

// Data Schema එක නිර්මාණය කිරීම
const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
  },
  {
    timestamps: true, // CreatedAt සහ UpdatedAt automatic එකතු වේ
  }
);

module.exports = mongoose.model('Item', ItemSchema);