const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Database Connection Call
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Root & Health Check Routes (ෆ්‍රන්ට්එන්ඩ් එකෙන් සර්වර් එක පරීක්ෂා කරන විට 404 ඒම වැළැක්වීමට)
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'SecureAI Backend is running successfully!' });
});

app.get('/api', (req, res) => {
  res.json({ status: 'success', message: 'SecureAI API is running successfully!' });
});

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// ලෝකල් පරිසරයේදී (Local) පමණක් app.listen ධාවනය වේ
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server එක Port ${PORT} හි වැඩ කරයි...`));
}

// Vercel Serverless Function සඳහා app එක අනිවාර්යයෙන්ම export කළ යුතුය
module.exports = app;