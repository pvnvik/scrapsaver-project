import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Donation from './models/Donation.js';
import Auction from './models/Auction.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scrapsaver';

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    let admin = await User.findOne({ email: 'admin@scrapsaver.test' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      admin = await User.create({
        name: 'ScrapSaver Admin',
        email: 'admin@scrapsaver.test',
        passwordHash,
        role: 'admin'
      });
      console.log('Created admin user with email admin@scrapsaver.test and password admin123');
    } else {
      console.log('Admin user already exists');
    }

    const donor = await User.findOne({ role: 'user' });
    if (!donor) {
      console.log('No donor user found. Skipping sample donation creation.');
    } else {
      const donation = await Donation.create({
        user: donor._id,
        wasteType: 'Mixed e-waste batch',
        quantityKg: 25
      });
      console.log('Created sample donation with quantity 25 kg');

      const auction = await Auction.create({ donation: donation._id, highestBid: 0 });
      console.log(`Created sample auction with id ${auction._id}`);
    }

  } catch (err) {
    console.error('Seeding failed', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();
