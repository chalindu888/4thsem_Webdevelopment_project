const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

// Database Connection Call
connectDB();

// CORS Middleware (Preflight සහ සියලුම Origins සඳහා ඉඩ ලබා දීම)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Preflight requests සඳහා OPTIONS හැසිරවීම
app.options('*', cors());

// Middleware
app.use(express.json());

// Root & Health Check Routes
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'SecureAI Backend is running successfully!' });
});

app.get('/api', (req, res) => {
  res.json({ status: 'success', message: 'SecureAI API is running successfully!' });
});

// API Routes (Singular සහ Plural රූට්ස් දෙකම සඳහා සහය දැක්වීම)
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/item', itemRoutes);

// Catch-all 404 for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `API endpoint ${req.originalUrl} not found on server.` 
  });
});

const PORT = process.env.PORT || 5000;

// ලෝකල් පරිසරයේදී (Local) පමණක් app.listen ධාවනය වේ
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server එක Port ${PORT} හි වැඩ කරයි...`));
}

// Vercel Serverless Function සඳහා app එක අනිවාර්යයෙන්ම export කළ යුතුය
module.exports = app;