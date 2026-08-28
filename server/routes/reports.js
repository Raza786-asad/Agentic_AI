/**
 * Reports Route — /api/reports
 * Persists AI-analyzed road defect reports with image paths to PostgreSQL.
 */
import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateReportId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `RD-${num}`;
}

function rowToReport(r) {
  return {
    id:            r.id,
    userId:        r.user_id,
    citizenName:   r.citizen_name,
    defectType:    r.defect_type,
    severity:      r.severity,
    confidence:    parseFloat(r.confidence),
    priorityScore: r.priority_score,
    area:          r.area,
    depth:         r.depth,
    waterlogging:  r.waterlogging,
    location:      r.location,
    lat:           parseFloat(r.lat),
    lng:           parseFloat(r.lng),
    imageUrl:      r.image_url,
    imageFilename: r.image_filename,
    status:        r.status,
    aiAssessment:  r.ai_assessment,
    isPothole:     r.is_pothole,
    state:         r.state,
    district:      r.district,
    city:          r.city,
    createdAt:     r.created_at,
    updatedAt:     r.updated_at,
  };
}

// ─── GET /api/reports/public-live — Live telemetry for landing page ─────────

router.get('/public-live', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, lat, lng, severity, priority_score, defect_type, created_at, status FROM reports WHERE status != \'Resolved\' ORDER BY created_at DESC LIMIT 100'
    );
    res.json({ success: true, reports: rows });
  } catch (err) {
    console.error('[Reports GET /public-live]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/reports — Citizen submits a report ────────────────────────────

router.post('/', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const {
      defectType   = 'Pothole',
      severity     = 'Medium',
      confidence   = 0,
      priorityScore = 0,
      area         = '0 m²',
      depth        = '0 cm',
      waterlogging = 'N/A',
      location,
      lat          = 0,
      lng          = 0,
      imageUrl     = null,
      imageFilename = null,
      aiAssessment = null,
      isPothole    = true,
      state        = null,
      district     = null,
    } = req.body;

    if (!location) {
      return res.status(400).json({ success: false, error: 'Location is required.' });
    }

    const id = generateReportId();

    const { rows } = await pool.query(
      `INSERT INTO reports
        (id, user_id, citizen_name, defect_type, severity, confidence,
         priority_score, area, depth, waterlogging, location, lat, lng,
         image_url, image_filename, ai_assessment, is_pothole, state, district, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'Reported')
       RETURNING *`,
      [
        id, user.id, user.name, defectType, severity, confidence,
        priorityScore, area, depth, waterlogging, location, lat, lng,
        imageUrl, imageFilename, aiAssessment, isPothole, state, district
      ]
    );

    // Auto-create a complaint record for citizens
    if (user.role === 'user') {
      const complaintId = `C-${Math.floor(2000 + Math.random() * 8000)}`;
      await pool.query(
        `INSERT INTO complaints
          (id, report_id, user_id, citizen_name, description, location, image_url, status, ai_similarity)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'Reported',0)`,
        [
          complaintId, id, user.id, user.name,
          `Reported ${defectType} at ${location}. AI Confidence: ${confidence}%.`,
          location, imageUrl
        ]
      );
    }

    res.status(201).json({ success: true, report: rowToReport(rows[0]) });
  } catch (err) {
    console.error('[Reports POST]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/reports — All reports (admin) ──────────────────────────────────

router.get('/', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const { state, district, city, severity, status } = req.query;
    
    let whereClauses = [];
    let queryParams = [];
    let paramIndex = 1;

    if (user.role !== 'admin') {
      whereClauses.push(`user_id = $${paramIndex++}`);
      queryParams.push(user.id);
    }

    if (state && state !== 'ALL') {
      whereClauses.push(`state = $${paramIndex++}`);
      queryParams.push(state);
    }
    if (district && district !== 'ALL') {
      whereClauses.push(`district = $${paramIndex++}`);
      queryParams.push(district);
    }
    if (city && city !== 'ALL') {
      whereClauses.push(`city = $${paramIndex++}`);
      queryParams.push(city);
    }
    if (severity && severity !== 'All') {
      whereClauses.push(`severity = $${paramIndex++}`);
      queryParams.push(severity);
    }
    if (status && status !== 'All') {
      whereClauses.push(`status = $${paramIndex++}`);
      queryParams.push(status);
    }

    const whereStr = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
    const query = `SELECT * FROM reports ${whereStr} ORDER BY created_at DESC LIMIT 500`;

    const { rows } = await pool.query(query, queryParams);
    res.json({ success: true, reports: rows.map(rowToReport) });
  } catch (err) {
    console.error('[Reports GET]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/reports/my — Citizen's own reports ────────────────────────────

router.get('/my', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, reports: rows.map(rowToReport) });
  } catch (err) {
    console.error('[Reports GET /my]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/reports/locations — Unique Locations ────────────────────────────

router.get('/locations', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT DISTINCT state, district, city FROM reports WHERE state IS NOT NULL ORDER BY state, district, city'
    );
    res.json({ success: true, locations: rows });
  } catch (err) {
    console.error('[Reports GET locations]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/reports/:id/status — Admin updates report status ─────────────

router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }

    const { status } = req.body;
    const { rows } = await pool.query(
      `UPDATE reports SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Report not found.' });

    res.json({ success: true, report: rowToReport(rows[0]) });
  } catch (err) {
    console.error('[Reports PATCH status]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
