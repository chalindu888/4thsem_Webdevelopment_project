const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// --- SIGNUP (නව ගිණුමක් තැනීම) ---
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Email එක කලින් භාවිතා කර ඇත්දැයි බැලීම
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ message: 'මෙම Email එක දැනටමත් ලියාපදිංචි කර ඇත.' });
    }

    // Password එක ආරක්ෂිතව Hash කිරීම
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // නව User කෙනෙකු සාදා Database එකට Save කිරීම
    user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      message: 'ලියාපදිංචිය සාර්ථකයි!',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error එකක් සිදුවිය.' });
  }
};

router.post('/signup', signup);
router.post('/register', signup);

// --- LOGIN (ගිණුමකට ඇතුළු වීම) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // User කෙනෙකු සිටීදැයි පරීක්ෂා කිරීම
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email එක හෝ Password එක වැරදියයි.' });
    }

    // Password එක නිවැරදිදැයි බැලීම
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email එක හෝ Password එක වැරදියයි.' });
    }

    // JWT Token එකක් සෑදීම
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login වීම සාර්ථකයි!',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error එකක් සිදුවිය.' });
  }
});

module.exports = router;