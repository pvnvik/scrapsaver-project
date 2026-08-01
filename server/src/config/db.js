import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.warn('Warning: MONGO_URI environment variable is not defined.');
  }

  try {
    const conn = await mongoose.connect(MONGO_URI || 'mongodb://127.0.0.1:27017/scrapsaver');
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
