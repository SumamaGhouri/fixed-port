import { Router } from 'express';
import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Portfolio from '../models/Portfolio.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const fallback = JSON.parse(readFileSync(path.join(here, '../data/portfolio.json'), 'utf8'));
const router = Router();

const dbUp = () => mongoose.connection.readyState === 1;

// GET /api/portfolio : the content the React app renders
router.get('/', async (_req, res) => {
  try {
    if (dbUp()) {
      const doc = await Portfolio.findOne({ key: 'main' }).lean();
      if (doc) return res.json(doc.data);
    }
  } catch (e) {
    console.error('DB read failed, using bundled data:', e.message);
  }
  res.json(fallback);
});

// PUT /api/portfolio : replace the content (send header x-admin-key)
router.put('/', async (req, res) => {
  if (!process.env.ADMIN_KEY || req.get('x-admin-key') !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!dbUp()) return res.status(503).json({ error: 'Database not connected' });
  const d = req.body;
  if (!d || !Array.isArray(d.companies) || !Array.isArray(d.certs) || !Array.isArray(d.projects)) {
    return res.status(400).json({ error: 'Invalid portfolio shape' });
  }
  await Portfolio.findOneAndUpdate({ key: 'main' }, { data: d }, { upsert: true, new: true });
  res.json({ ok: true });
});

export default router;
