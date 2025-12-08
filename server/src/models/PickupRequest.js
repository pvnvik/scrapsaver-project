import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    wasteType: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    preferredTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['requested', 'scheduled', 'completed', 'cancelled'],
      default: 'requested'
    }
  },
  { timestamps: true }
);

export default mongoose.model('PickupRequest', pickupRequestSchema);
