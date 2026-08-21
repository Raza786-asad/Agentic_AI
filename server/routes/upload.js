/**
 * Image Upload Route — /api/upload/image
 * Accepts multipart road photo uploads via multer.
 * Saves files to server/uploads/ and returns the accessible URL path.
 */
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyToken } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const router = express.Router();

// Store files in server/uploads/
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../server/uploads'));
  },
  filename(req, file, cb) {
    const ext      = path.extname(file.originalname) || '.jpg';
    const safeName = `road_${Date.now()}_${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB max
  fileFilter(req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  }
});

/**
 * POST /api/upload/image
 * Body: multipart form-data  { image: <file> }
 * Returns: { success, imageUrl, filename }
 */
router.post('/image', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file received.' });
  }

  const imageUrl  = `/uploads/${req.file.filename}`;
  const filename  = req.file.filename;
  const originalName = req.file.originalname;

  res.status(201).json({
    success: true,
    imageUrl,
    filename,
    originalName,
    size: req.file.size,
  });
});

export default router;
