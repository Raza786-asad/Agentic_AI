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
    citizenPhone:    r.citizen_phone || '9876543210',
    citizenAddress:  r.citizen_address || 'Not specified',
    citizenEmail:    r.citizen_email || '',
    description:     r.description,
    location:        r.location,
    image:           r.image_url,  // keep field name compatible with ComplaintsPage
    status:          r.report_status || r.status,
    aiSimilarity:    parseFloat(r.ai_similarity || 0),
    matchedDefectId: r.matched_defect_id,
    isMerged:        r.is_merged,
    date:            r.created_at,
    severity:        r.severity || 'Medium',
    priorityScore:   r.priority_score || 50,
    defectType:      r.defect_type || 'Pothole',
    confidence:      parseFloat(r.confidence || 0),
    lat:             r.lat ? parseFloat(r.lat) : 16.222,
    lng:             r.lng ? parseFloat(r.lng) : 80.444,
    whatsappVerified: r.whatsapp_verified || false
  };
}

// ─── GET /api/complaints ─────────────────────────────────────────────────────

router.get('/', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    let rows;

    if (user.role === 'admin') {
      ({ rows } = await pool.query(
        `SELECT 
           c.*, 
           r.status AS report_status, r.severity, r.priority_score, r.defect_type, r.confidence, r.lat, r.lng,
           u.phone AS citizen_phone, u.address AS citizen_address, u.email AS citizen_email
         FROM complaints c
         LEFT JOIN reports r ON c.report_id = r.id
         LEFT JOIN users u ON c.user_id = u.id
         ORDER BY c.created_at DESC LIMIT 200`
      ));
    } else {
      ({ rows } = await pool.query(
        `SELECT 
           c.*, 
           r.status AS report_status, r.severity, r.priority_score, r.defect_type, r.confidence, r.lat, r.lng,
           u.phone AS citizen_phone, u.address AS citizen_address, u.email AS citizen_email
         FROM complaints c
         LEFT JOIN reports r ON c.report_id = r.id
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.user_id = $1 
         ORDER BY c.created_at DESC`,
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

    // Attach missing joined fields so the frontend state doesn't default to mock data
    const userResult = await pool.query('SELECT phone, address, email FROM users WHERE id = $1', [user.id]);
    if (userResult.rows.length > 0) {
      rows[0].citizen_phone = userResult.rows[0].phone;
      rows[0].citizen_address = userResult.rows[0].address;
      rows[0].citizen_email = userResult.rows[0].email;
    }

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

// ─── DELETE /api/complaints/:id ──────────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const complaintId = req.params.id;

    // Check if complaint exists
    const { rows } = await pool.query(
      'SELECT * FROM complaints WHERE id = $1',
      [complaintId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }

    const complaint = rows[0];

    // Only allow owner (or admin) to delete
    if (user.role !== 'admin' && complaint.user_id !== user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this complaint.' });
    }

    // Check if complaint is verified / merged
    if (complaint.is_merged) {
      return res.status(400).json({ success: false, error: 'Cannot delete a verified or merged complaint.' });
    }

    // Delete the complaint
    await pool.query('DELETE FROM complaints WHERE id = $1', [complaintId]);

    res.json({ success: true, message: 'Complaint deleted successfully.' });
  } catch (err) {
    console.error('[Complaints DELETE]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/complaints/:id/whatsapp-verify — Admin verifies complaint via simulated WhatsApp ───
router.patch('/:id/whatsapp-verify', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }

    // Set whatsapp_verified to true and update status
    await pool.query(
      `UPDATE complaints 
       SET whatsapp_verified = TRUE, status = 'WhatsApp Verified', updated_at = NOW() 
       WHERE id = $1`,
      [req.params.id]
    );

    // Retrieve full updated details
    const { rows } = await pool.query(
      `SELECT 
         c.*, 
         r.status AS report_status, r.severity, r.priority_score, r.defect_type, r.confidence, r.lat, r.lng,
         u.phone AS citizen_phone, u.address AS citizen_address, u.email AS citizen_email
       FROM complaints c
       LEFT JOIN reports r ON c.report_id = r.id
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Complaint not found.' });
    res.json({ success: true, complaint: rowToComplaint(rows[0]) });
  } catch (err) {
    console.error('[Complaints WhatsApp Verify]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/complaints/:id/status — Admin updates complaint status ───
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }

    const { status } = req.body;

    await pool.query(
      `UPDATE complaints 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2`,
      [status, req.params.id]
    );

    // Retrieve full updated details
    const { rows } = await pool.query(
      `SELECT 
         c.*, 
         r.status AS report_status, r.severity, r.priority_score, r.defect_type, r.confidence, r.lat, r.lng,
         u.phone AS citizen_phone, u.address AS citizen_address, u.email AS citizen_email
       FROM complaints c
       LEFT JOIN reports r ON c.report_id = r.id
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Complaint not found.' });
    res.json({ success: true, complaint: rowToComplaint(rows[0]) });
  } catch (err) {
    console.error('[Complaints Status Update]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
