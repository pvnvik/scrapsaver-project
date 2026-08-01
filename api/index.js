import app from '../server/src/app.js';
import connectDB from '../server/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error in Vercel function:', error);
    return res.status(500).json({ 
      message: 'Database Connection Failure', 
      error: error.message 
    });
  }
  return app(req, res);
}
