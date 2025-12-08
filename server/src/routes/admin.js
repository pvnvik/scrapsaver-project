import express from 'express';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Auction from '../models/Auction.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Get system stats - Admin only
router.get('/stats', authMiddleware(['admin']), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalRecyclers = await User.countDocuments({ role: 'recycler' });

        // Aggregations for total impact
        const impactStats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalWeight: { $sum: '$impact.totalWeightKg' },
                    totalCo2: { $sum: '$impact.co2SavedKg' },
                    totalResources: { $sum: '$impact.resourcesConservedKg' }
                }
            }
        ]);

        const stats = impactStats[0] || { totalWeight: 0, totalCo2: 0, totalResources: 0 };

        res.json({
            totalUsers,
            totalRecyclers,
            totalWeightKg: stats.totalWeight,
            co2SavedKg: stats.totalCo2,
            resourcesConservedKg: stats.totalResources
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Analytics for charts - Admin only
router.get('/analytics', authMiddleware(['admin']), async (req, res) => {
    try {
        const wasteDistribution = await Donation.aggregate([
            {
                $group: {
                    _id: '$wasteType',
                    value: { $sum: '$quantityKg' }
                }
            },
            {
                $project: {
                    name: '$_id',
                    value: 1,
                    _id: 0
                }
            }
        ]);
        res.json(wasteDistribution);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
});

export default router;
