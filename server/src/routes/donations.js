import express from 'express';
import { generateCertificate } from '../utils/certificateGenerator.js';
import Donation from '../models/Donation.js';
import User from '../models/User.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

const CO2_FACTOR = 1.5; // kg CO2 saved per kg
const RESOURCE_FACTOR = 0.8; // kg resources conserved per kg

router.post('/', authMiddleware(['user']), async (req, res) => {
  try {
    const { wasteType, quantityKg } = req.body;
    const donation = await Donation.create({
      user: req.user.id,
      wasteType,
      quantityKg
    });

    const user = await User.findById(req.user.id);
    user.impact.totalWeightKg += quantityKg;
    user.impact.co2SavedKg += quantityKg * CO2_FACTOR;
    user.impact.resourcesConservedKg += quantityKg * RESOURCE_FACTOR;
    await user.save();

    res.status(201).json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create donation' });
  }
});

router.get('/', authMiddleware(), async (req, res) => {
  const donations = await Donation.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(donations);
});

// Get unassigned donations for auctions
router.get('/unassigned', authMiddleware(['admin']), async (req, res) => {
  try {
    // Find donations that are NOT in any auction
    // This is a bit tricky without a direct reference, but let's assume one-to-one
    // Alternatively, we look for donations where status is 'pending' 
    const donations = await Donation.find({ status: 'pending' });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch unassigned donations' });
  }
});

router.get('/:id/certificate', authMiddleware(['user']), async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Ensure user owns this donation
    if (donation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user.id);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${donation._id}.pdf`);

    const doc = generateCertificate(donation, user);
    doc.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }
});

export default router;
