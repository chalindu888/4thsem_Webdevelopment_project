const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB එකට සාර්ථකව සම්බන්ධ වුණා!');
  } catch (err) {
    console.log('Database Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;