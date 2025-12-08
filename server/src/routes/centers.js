import express from 'express';
import Center from '../models/Center.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const centers = await Center.find();
  res.json(centers);
});

export default router;
