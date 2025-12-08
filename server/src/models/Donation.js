import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    wasteType: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'completed'],
      default: 'pending'
    },
    pickupRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'PickupRequest' }
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
