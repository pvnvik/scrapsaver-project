import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    hours: { type: String },
    phone: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Center', centerSchema);
