const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// One-time admin registration (lock down with ADMIN_SETUP_TOKEN in production)
router.post('/register-admin', async (req, res, next) => {
  try {
    const { email, password, setupToken } = req.body;

    const expectedToken = process.env.ADMIN_SETUP_TOKEN;
    if (expectedToken && setupToken !== expectedToken) {
      return res.status(403).json({ message: 'Invalid setup token' });
    }
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, role: 'admin' });
    await user.save();

    res.status(201).json({ message: 'Admin user created' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === 'change-me') {
      console.error('WARNING: JWT_SECRET not set or using default value');
    }
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const token = jwt.sign(payload, jwtSecret || 'change-me', {
      expiresIn: '8h',
    });

    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
