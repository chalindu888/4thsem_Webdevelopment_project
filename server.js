const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({ path: require('path').join(__dirname, 'backend', '.env') });
dotenv.config({ path: require('path').join(__dirname, 'new.env') });
connectDB();

const app = express();

app.use(helmet());
// Allow the Vite dev server on any localhost port (Vite moves to 5174, 5175... when 5173 is taken).
app.use(cors({
  origin: /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assessment', require('./routes/assessmentRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Security System API is running smoothly.',
    environment: process.env.NODE_ENV
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});