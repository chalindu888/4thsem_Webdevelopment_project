const path = require('path');
const dotenv = require('dotenv');

// Local development: load backend/.env (and the older ../new.env if present).
// On Vercel these files don't exist; the project's Environment Variables are used instead.
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });
dotenv.config({ path: path.join(__dirname, '..', 'new.env'), quiet: true });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB, pingDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// ------------------------------
// 1. Security middleware
// ------------------------------
app.use(helmet());

// ------------------------------
// 2. CORS configuration
// ------------------------------
// FRONTEND_URL may hold one URL or a comma-separated list.
const allowedOrigins = new Set([
  'https://4thsem-webdevelopment-project-c48i.vercel.app',
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
]);

// Preview deployments of the frontend project, e.g. 4thsem-webdevelopment-project-c48i-abc123-chalindu888.vercel.app
const PREVIEW_ORIGIN = /^https:\/\/4thsem-webdevelopment-project-c48i-[a-z0-9-]+\.vercel\.app$/;
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(cors({
  origin: (origin, callback) => {
    // No Origin header: server-to-server calls, curl, health checks.
    if (!origin || allowedOrigins.has(origin) || PREVIEW_ORIGIN.test(origin) || LOCAL_ORIGIN.test(origin)) {
      return callback(null, true);
    }
    const error = new Error('CORS origin not allowed');
    error.status = 403;
    return callback(error);
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

if (!isProduction) {
  app.use(morgan('dev'));
}

// ------------------------------
// 4. MongoDB connection (opened lazily, reused across requests)
// ------------------------------
const withDatabase = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(503).json({
      success: false,
      message: 'Database temporarily unavailable. Please try again shortly.',
    });
  }
};

// ------------------------------
// 5. Health checks (registered before the API 404 handler)
// ------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SecureAI Backend API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Succeeds only when MongoDB really answers a ping.
app.get('/api/health/db', async (req, res) => {
  try {
    await pingDB();
    res.status(200).json({ success: true, database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(503).json({ success: false, database: 'disconnected' });
  }
});

app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to SecureAI Backend API',
    health: '/api/health',
  });
});

// ------------------------------
// 6. API routes (singular and plural paths both work)
// ------------------------------
app.use('/api/auth', withDatabase, authRoutes);
app.use(['/api/assessment', '/api/assessments'], withDatabase, assessmentRoutes);
app.use(['/api/items', '/api/item'], withDatabase, itemRoutes);

// ------------------------------
// 7. Unknown API routes
// ------------------------------
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ------------------------------
// 8. Global error handler — never leaks internals in production
// ------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.message === 'CORS origin not allowed') {
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid request data' });
  }

  // Malformed JSON body.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body must be valid JSON' });
  }

  const statusCode = err.statusCode || err.status || 500;
  if (statusCode >= 500) {
    console.error('Server error:', err.message);
  }

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode >= 500
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error',
  });
});

// Log stray async failures instead of letting them crash the function.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason instanceof Error ? reason.message : reason);
});

// ------------------------------
// 9. Local server (Vercel imports the app instead and never calls listen)
// ------------------------------
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`SecureAI server running on port ${PORT}`);
  });
}

module.exports = app;
