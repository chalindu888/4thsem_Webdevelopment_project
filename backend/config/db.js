const mongoose = require('mongoose');

// Vercel reuses a function instance for many requests, so keep one connection (or one
// in-flight attempt) per instance instead of reconnecting on every request.
let connecting = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  // Fully disconnected (e.g. the last attempt failed): start a fresh attempt.
  if (mongoose.connection.readyState === 0) {
    connecting = null;
  }

  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => {
        console.log('MongoDB connected successfully');
        return mongoose.connection;
      })
      .catch((error) => {
        // Don't cache a failure; the next request retries. Never exit the process here.
        connecting = null;
        console.error('MongoDB connection failed:', error.message);
        throw error;
      });
  }

  return connecting;
};

// Proves the database actually answers (used by /api/health/db).
const pingDB = async () => {
  await connectDB();
  await mongoose.connection.db.admin().command({ ping: 1 });
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.pingDB = pingDB;
