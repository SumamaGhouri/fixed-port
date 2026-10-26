import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Portfolio from '../models/Portfolio.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.join(here, '../data/portfolio.json'), 'utf8'));

if (!process.env.MONGO_URI) {
  console.error('Set MONGO_URI in server/.env first.');
  process.exit(1);
}
await mongoose.connect(process.env.MONGO_URI);
await Portfolio.findOneAndUpdate({ key: 'main' }, { data }, { upsert: true, new: true });
console.log('Portfolio content seeded into MongoDB.');
await mongoose.disconnect();
