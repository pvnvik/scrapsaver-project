import express from 'express';
import PickupRequest from '../models/PickupRequest.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

router.post('/', authMiddleware(['user']), async (req, res) => {
  try {
    const { address, wasteType, quantityKg, preferredTime } = req.body;
    const pickup = await PickupRequest.create({
      user: req.user.id,
      address,
      wasteType,
      quantityKg,
      preferredTime
    });
    res.status(201).json(pickup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create pickup request' });
  }
});

router.get('/', authMiddleware(), async (req, res) => {
  let query = { user: req.user.id };
  if (req.user.role === 'admin' || req.user.role === 'center') {
    query = {};
  }
  const pickups = await PickupRequest.find(query).sort({ preferredTime: 1 }).populate('user', 'name email');
  res.json(pickups);
});

router.patch('/:id/status', authMiddleware(['admin', 'center']), async (req, res) => {
  try {
    const { status } = req.body;
    const pickup = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

export default router;
