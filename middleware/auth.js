const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'You must be logged in to do that.' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'secureai-development-secret');
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'Your session has expired. Please log in again.'
      : 'Your session is invalid. Please log in again.';
    return res.status(401).json({ success: false, message });
  }

  try {
    const user = await User.findById(payload.id).select('_id name email');
    if (!user) return res.status(401).json({ success: false, message: 'Your account no longer exists. Please log in again.' });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
