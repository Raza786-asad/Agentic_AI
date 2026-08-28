import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import apiRoutes from './routes/api.js';
import { runMigrations } from './migrations/migrate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Create uploads directory if it doesn't exist ────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ─── Serve uploaded images as static files ────────────────────────────────────
app.use('/uploads', cors(), express.static(uploadsDir));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ─── SPA Fallback (serves Vite build in production) ──────────────────────────
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get(/.*/, (req, res) => {
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.json({
      message: 'ROADNEX API Server running.',
      frontendDevUrl: 'http://localhost:3000',
      apiHealth: `http://localhost:${PORT}/api/health`
    });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
async function startServer() {
  // Run DB schema migrations first
  await runMigrations();

  app.listen(PORT, () => {
    console.log(`
  ======================================================
  🚀 ROADNEX - EXPRESS API SERVER v2.0
  ======================================================
  ▸ API Base URL:   http://localhost:${PORT}/api
  ▸ Health Check:   http://localhost:${PORT}/api/health
  ▸ Uploads:        http://localhost:${PORT}/uploads/
  ▸ Vite Frontend:  http://localhost:3000
  ▸ Database:       PostgreSQL (Neon Serverless)
  ======================================================
  `);
  });
}

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});
