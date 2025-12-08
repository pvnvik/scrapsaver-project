import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import donationRoutes from './routes/donations.js';
import pickupRoutes from './routes/pickups.js';
import auctionRoutes from './routes/auctions.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scrapsaver';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

io.on('connection', socket => {
  console.log('Recycler/web client connected to Socket.IO');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/auctions', auctionRoutes(io));
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ScrapSaver API running' });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
