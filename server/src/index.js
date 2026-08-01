import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import auctionRoutes from './routes/auctions.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Re-register auctions route with real socket.io instance for local dev
app.use('/api/auctions', auctionRoutes(io));

io.on('connection', socket => {
  console.log('Recycler/web client connected to Socket.IO');
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
