import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import donationRoutes from './routes/donations.js';
import pickupRoutes from './routes/pickups.js';
import auctionRoutes from './routes/auctions.js';
import adminRoutes from './routes/admin.js';
import centerRoutes from './routes/centers.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Fallback mock io instance when running in serverless / stateless mode
const ioMock = { emit: () => {} };

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/auctions', auctionRoutes(ioMock));
app.use('/api/admin', adminRoutes);
app.use('/api/centers', centerRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'ScrapSaver API running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'ScrapSaver API running' });
});

export default app;
