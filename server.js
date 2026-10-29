
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Load environment variables for local development.
// Vercel provides production environment variables directly.
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });
dotenv.config({ path: path.join(__dirname, 'new.env') });

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

const app = express();

// ------------------------------
// 1. Security middleware
// ------------------------------
app.use(helmet());

// ------------------------------
// 2. CORS configuration
// ------------------------------
const allowedOrigins = [
  'https://4thsem-webdevelopment-project-c48i.vercel.app',
  'https://4thsem-webdevelopment-project-c48i-fm9z3w53v-chalindu888.vercel.app',
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL.replace(/\/$/, '')
  );
}

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ------------------------------
// 3. Request middleware
// ------------------------------
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ------------------------------
// 4. MongoDB connection
// ------------------------------
let connectionPromise = null;

async function ensureDatabaseConnection() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is missing');
  }

  if (!connectionPromise) {
    connectionPromise = connectDB()
      .then(() => {
        if (mongoose.connection.readyState !== 1) {
          throw new Error('MongoDB connection was not established');
        }
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

// Make sure MongoDB is ready before database API requests.
// Authentication and assessment both require MongoDB.
app.use('/api/auth', async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(503).json({
      success: false,
      message: 'Database temporarily unavailable',
    });
  }
});

app.use('/api/assessment', async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(503).json({
      success: false,
      message: 'Database temporarily unavailable',
    });
  }
});

// ------------------------------
// 5. API routes
// ------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);

// ------------------------------
// 6. Health check
// ------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SecureAI Backend API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------
// 7. Database health check
// ------------------------------
app.get('/api/health/db', async (req, res) => {
  try {
    await ensureDatabaseConnection();

    res.status(200).json({
      success: true,
      database: 'connected',
    });
  } catch (error) {
    console.error('Database health check failed:', error.message);

    res.status(503).json({
      success: false,
      database: 'disconnected',
    });
  }
});

// ------------------------------
// 8. Default route
// ------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to SecureAI Backend API',
    health: '/api/health',
  });
});

// ------------------------------
// 9. Unknown API routes
// ------------------------------
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ------------------------------
// 10. Global error handler
// ------------------------------
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err.message === 'CORS origin not allowed') {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed',
    });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
    });
  }

  const statusCode =
    err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production' &&
      statusCode >= 500
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
  });
});

// ------------------------------
// 11. Start local server
// ------------------------------
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SecureAI server running on port ${PORT}`);
  });
}

// ------------------------------
// 12. Export Express app for Vercel
// ------------------------------
module.exports = app;
