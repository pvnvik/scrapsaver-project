import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Donation from './models/Donation.js';
import Auction from './models/Auction.js';
import Center from './models/Center.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scrapsaver';

const SAMPLE_CENTERS = [
  {
    name: 'EcoLoop Koramangala Drop-Off Hub',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
    city: 'Bengaluru',
    type: 'collection_point',
    latitude: 12.9352,
    longitude: 77.6245,
    hours: 'Mon-Sat, 9:00 AM - 7:00 PM',
    phone: '+91 80 4123 7890',
    acceptedTypes: ['Laptops', 'Mobile Phones', 'Batteries', 'Chargers']
  },
  {
    name: 'GreenGrid Certified E-Recyclers',
    address: 'Peenya Industrial Area Phase II, Bengaluru',
    city: 'Bengaluru',
    type: 'recycler',
    latitude: 13.0285,
    longitude: 77.5197,
    hours: 'Mon-Fri, 8:30 AM - 6:00 PM',
    phone: '+91 80 4987 1122',
    acceptedTypes: ['Servers', 'Monitors', 'Printers', 'Laptops', 'PCB Scrap']
  },
  {
    name: 'Sahyadri E-Waste Collection Point',
    address: 'Link Road, Andheri West, Mumbai',
    city: 'Mumbai',
    type: 'collection_point',
    latitude: 19.1364,
    longitude: 72.8296,
    hours: 'Tue-Sun, 10:00 AM - 6:30 PM',
    phone: '+91 22 2634 5510',
    acceptedTypes: ['Mobile Phones', 'Tablets', 'Batteries', 'Small Appliances']
  },
  {
    name: 'MetroCircuits Authorized Recycler',
    address: 'MIDC Industrial Area, Turbhe, Navi Mumbai',
    city: 'Mumbai',
    type: 'recycler',
    latitude: 19.0771,
    longitude: 73.0169,
    hours: 'Mon-Sat, 9:00 AM - 5:30 PM',
    phone: '+91 22 2768 4401',
    acceptedTypes: ['Laptops', 'Desktops', 'Monitors', 'Cables', 'Industrial E-Waste']
  },
  {
    name: 'Yamuna CleanTech Drop-Off Center',
    address: 'Nehru Place Commercial Complex, New Delhi',
    city: 'New Delhi',
    type: 'collection_point',
    latitude: 28.5494,
    longitude: 77.2519,
    hours: 'Mon-Sat, 10:00 AM - 7:00 PM',
    phone: '+91 11 4160 8899',
    acceptedTypes: ['Laptops', 'Mobile Phones', 'Keyboards', 'Batteries']
  },
  {
    name: 'Capital Reclaim E-Recycling Facility',
    address: 'Okhla Industrial Estate Phase III, New Delhi',
    city: 'New Delhi',
    type: 'recycler',
    latitude: 28.5404,
    longitude: 77.2709,
    hours: 'Mon-Fri, 9:00 AM - 6:00 PM',
    phone: '+91 11 4052 3300',
    acceptedTypes: ['Servers', 'TVs & Monitors', 'Appliances', 'Data Destruction']
  },
  {
    name: 'Deccan GreenDrop Collection Hub',
    address: 'Madhapur HITEC City Main Rd, Hyderabad',
    city: 'Hyderabad',
    type: 'collection_point',
    latitude: 17.4483,
    longitude: 78.3915,
    hours: 'Mon-Sat, 9:30 AM - 6:30 PM',
    phone: '+91 40 2311 7744',
    acceptedTypes: ['Laptops', 'Mobile Phones', 'Monitors', 'Batteries']
  },
  {
    name: 'Sahara EcoRecovery Recycler',
    address: 'Bhosari MIDC Sector 7, Pune',
    city: 'Pune',
    type: 'recycler',
    latitude: 18.6279,
    longitude: 73.8421,
    hours: 'Mon-Sat, 9:00 AM - 5:30 PM',
    phone: '+91 20 2712 9045',
    acceptedTypes: ['Laptops', 'Desktops', 'Circuit Boards', 'Heavy Appliances']
  }
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    for (const centerData of SAMPLE_CENTERS) {
      await Center.findOneAndUpdate(
        { name: centerData.name },
        { $set: centerData },
        { upsert: true, new: true }
      );
    }
    console.log(`Seeded ${SAMPLE_CENTERS.length} e-waste centers and recyclers`);

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
