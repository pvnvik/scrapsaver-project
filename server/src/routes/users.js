import express from 'express';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

router.get('/me', authMiddleware(), async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const donations = await Donation.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ user, donations });
});

export default router;
