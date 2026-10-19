import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(422).json({ errors: [{ msg: 'Email already in use', path: 'email' }] });
      }

      const user = await User.create({ name, email, password });
      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: 'Server error during registration.' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = generateToken(user._id);
      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login.' });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
});

// PATCH /api/auth/profile
router.patch('/profile', protect, async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name?.trim()) user.name = name.trim();
    if (email?.trim()) {
      const taken = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: user._id } });
      if (taken) return res.status(409).json({ message: 'Email already in use.' });
      user.email = email.toLowerCase().trim();
    }
    if (password) {
      if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      if (password_confirmation !== undefined && password !== password_confirmation) {
        return res.status(400).json({ message: 'Passwords do not match.' });
      }
      user.password = password;
    }
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ message: 'Profile update failed.' });
  }
});

export default router;
