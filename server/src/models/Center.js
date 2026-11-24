import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: '' },
    type: {
      type: String,
      enum: ['collection_point', 'recycler'],
      default: 'collection_point'
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    hours: { type: String },
    phone: { type: String },
    acceptedTypes: {
      type: [String],
      default: ['Laptops', 'Mobile Phones', 'Batteries', 'Cables & Chargers']
    },
    verified: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Center', centerSchema);
