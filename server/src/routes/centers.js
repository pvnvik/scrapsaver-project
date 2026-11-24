import express from 'express';
import Center from '../models/Center.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

const EARTH_RADIUS_KM = 6371;

const toRadians = (deg) => (deg * Math.PI) / 180;

/**
 * Compute great-circle distance in kilometers between two coordinates.
 */
function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((EARTH_RADIUS_KM * c).toFixed(2));
}

// List centers with optional geolocation sorting, radius, type, and search filters
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radiusKm, type, q } = req.query;
    const filter = {};

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { name: regex },
        { address: regex },
        { city: regex },
        { acceptedTypes: regex }
      ];
    }

    const centers = await Center.find(filter).lean();

    const userLat = lat !== undefined ? Number(lat) : NaN;
    const userLng = lng !== undefined ? Number(lng) : NaN;
    const hasCoords = Number.isFinite(userLat) && Number.isFinite(userLng);

    let results = centers.map((center) => ({
      ...center,
      distanceKm: hasCoords
        ? calculateDistanceKm(userLat, userLng, center.latitude, center.longitude)
        : null
    }));

    if (hasCoords) {
      const maxRadius = radiusKm !== undefined ? Number(radiusKm) : NaN;
      if (Number.isFinite(maxRadius) && maxRadius > 0) {
        results = results.filter((c) => c.distanceKm <= maxRadius);
      }
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json(results);
  } catch (err) {
    console.error('Error fetching centers:', err);
    res.status(500).json({ message: 'Failed to fetch e-waste centers' });
  }
});

// Create a new e-waste collection point or certified recycler (Admin only)
router.post('/', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, address, city, type, latitude, longitude, hours, phone, acceptedTypes } = req.body;
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Name, address, latitude, and longitude are required' });
    }

    const center = await Center.create({
      name,
      address,
      city: city || '',
      type: type || 'collection_point',
      latitude: Number(latitude),
      longitude: Number(longitude),
      hours: hours || 'Mon-Sat, 9:00 AM - 6:00 PM',
      phone: phone || '',
      acceptedTypes: Array.isArray(acceptedTypes) && acceptedTypes.length
        ? acceptedTypes
        : ['Laptops', 'Mobile Phones', 'Batteries', 'Small Appliances']
    });

    res.status(201).json(center);
  } catch (err) {
    console.error('Error creating center:', err);
    res.status(500).json({ message: 'Failed to create e-waste center' });
  }
});

export default router;
