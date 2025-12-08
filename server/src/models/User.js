import mongoose from 'mongoose';

const impactSchema = new mongoose.Schema({
  totalWeightKg: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  resourcesConservedKg: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'recycler', 'admin'], default: 'user' },
    impact: { type: impactSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
