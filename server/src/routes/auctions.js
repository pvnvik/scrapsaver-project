import express from 'express';
import Auction from '../models/Auction.js';
import Donation from '../models/Donation.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

const createAuctionRouter = io => {
  router.post('/', authMiddleware(['admin']), async (req, res) => {
    try {
      const { donationId } = req.body;
      const donation = await Donation.findById(donationId);
      if (!donation) return res.status(404).json({ message: 'Donation not found' });

      const auction = await Auction.create({ donation: donationId });
      io.emit('auction:created', auction);
      res.status(201).json(auction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create auction' });
    }
  });

  router.get('/', authMiddleware(['recycler', 'admin']), async (req, res) => {
    const auctions = await Auction.find()
      .populate('donation')
      .populate('bids.recycler', 'name email')
      .sort({ createdAt: -1 });
    res.json(auctions);
  });

  router.post('/:id/bids', authMiddleware(['recycler']), async (req, res) => {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);
    if (!auction || auction.status !== 'open') {
      return res.status(400).json({ message: 'Auction not open' });
    }

    const bid = { recycler: req.user.id, amount };
    auction.bids.push(bid);
    if (amount > auction.highestBid) auction.highestBid = amount;  // <-- updates highestBid
    await auction.save();

    const populated = await Auction.findById(auction._id).populate('donation');
    io.emit('auction:bid', populated);
    res.status(201).json(populated);
  });

  router.post('/:id/close', authMiddleware(['admin']), async (req, res) => {
    try {
      const auction = await Auction.findById(req.params.id);
      if (!auction) return res.status(404).json({ message: 'Auction not found' });
      auction.status = 'closed';
      await auction.save();
      io.emit('auction:closed', auction);
      res.json(auction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to close auction' });
    }
  });

  return router;
};

export default createAuctionRouter;
