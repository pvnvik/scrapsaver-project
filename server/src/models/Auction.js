import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    recycler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const auctionSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    bids: [bidSchema],
    highestBid: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Auction', auctionSchema);
