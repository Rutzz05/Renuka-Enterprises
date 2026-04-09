const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

const buildToken = (user) =>
  jwt.sign(
    {
      user: {
        id: user._id.toString(),
        role: user.role,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: 'customer',
    });

    await user.save();

    return res.status(201).json({
      token: buildToken(user),
      user: serializeUser(user),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({ message: 'You do not have access to this portal' });
    }

    return res.json({
      token: buildToken(user),
      user: serializeUser(user),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to log in' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(serializeUser(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to fetch current user' });
  }
});

router.get('/customers', auth, adminAuth, async (_req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    return res.json(customers.map(serializeUser));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to fetch customers' });
  }
});

module.exports = router;
