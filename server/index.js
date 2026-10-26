import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import portfolio from './routes/portfolio.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
);
app.use('/api/portfolio', portfolio);

// Production: serve the built React app (videos, images, three.js are inside client/dist)
const dist = path.join(here, '../client/dist');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((e) => console.error('MongoDB connection failed, serving bundled data:', e.message));
} else {
  console.log('No MONGO_URI set: serving bundled data (run with MongoDB to edit content live).');
}

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
