/**
 * Complaints Route — /api/complaints
 * Citizen complaint management and admin merge operations.
 */
import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

function rowToComplaint(r) {
  return {
    id:              r.id,
    reportId:        r.report_id,
    userId:          r.user_id,
    citizenName:     r.citizen_name,
    description:     r.description,
    location:        r.location,
    image:           r.image_url,  // keep field name compatible with ComplaintsPage
    status:          r.status,
    aiSimilarity:    parseFloat(r.ai_similarity || 0),
    matchedDefectId: r.matched_defect_id,
    isMerged:        r.is_merged,
    date:            r.created_at,
  };
}

// ─── GET /api/complaints ─────────────────────────────────────────────────────

router.get('/', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    let rows;

    if (user.role === 'admin') {
      ({ rows } = await pool.query(
        'SELECT * FROM complaints ORDER BY created_at DESC LIMIT 200'
      ));
    } else {
      ({ rows } = await pool.query(
        'SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC',
        [user.id]
      ));
    }

    res.json({ success: true, complaints: rows.map(rowToComplaint) });
  } catch (err) {
    console.error('[Complaints GET]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/complaints ────────────────────────────────────────────────────

router.post('/', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const { reportId, description, location, imageUrl, aiSimilarity, matchedDefectId } = req.body;

    if (!description || !location) {
      return res.status(400).json({ success: false, error: 'description and location are required.' });
    }

    const id = `C-${Math.floor(2000 + Math.random() * 8000)}`;
    const { rows } = await pool.query(
      `INSERT INTO complaints
        (id, report_id, user_id, citizen_name, description, location, image_url, ai_similarity, matched_defect_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [id, reportId || null, user.id, user.name, description, location, imageUrl || null, aiSimilarity || 0, matchedDefectId || null]
    );

    res.status(201).json({ success: true, complaint: rowToComplaint(rows[0]) });
  } catch (err) {
    console.error('[Complaints POST]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/complaints/:id/merge — Admin merges a complaint ──────────────

router.patch('/:id/merge', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }

    const { matchedDefectId } = req.body;
    const status = `Merged into ${matchedDefectId}`;

    const { rows } = await pool.query(
      `UPDATE complaints
       SET status = $1, matched_defect_id = $2, is_merged = TRUE, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, matchedDefectId, req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Complaint not found.' });
    res.json({ success: true, complaint: rowToComplaint(rows[0]) });
  } catch (err) {
    console.error('[Complaints PATCH merge]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
