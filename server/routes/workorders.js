/**
 * Work Orders Route — /api/work-orders
 * Municipal maintenance dispatch management.
 */
import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

function rowToWorkOrder(r) {
  return {
    id:               r.id,
    reportId:         r.report_id,
    defectId:         r.defect_id || r.id,
    defectType:       r.defect_type,
    location:         r.location,
    lat:              parseFloat(r.lat),
    lng:              parseFloat(r.lng),
    severity:         r.severity,
    priority:         r.priority,
    priorityScore:    r.priority_score,
    status:           r.status,
    contractor:       r.contractor,
    targetCompletion: r.target_completion,
    estimatedCost:    r.estimated_cost,
    createdAt:        r.created_at,
    updatedAt:        r.updated_at,
  };
}

// ─── GET /api/work-orders ────────────────────────────────────────────────────

router.get('/', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM work_orders ORDER BY created_at DESC LIMIT 200'
    );
    res.json({ success: true, workOrders: rows.map(rowToWorkOrder) });
  } catch (err) {
    console.error('[WorkOrders GET]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/work-orders — Admin creates a work order ──────────────────────

router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      reportId      = null,
      defectId      = null,
      defectType    = 'Pothole',
      location,
      lat           = 0,
      lng           = 0,
      severity      = 'Medium',
      priority      = 'High',
      priorityScore = 80,
      contractor    = 'Unassigned',
      targetCompletion = null,
      estimatedCost = '₹0',
    } = req.body;

    if (!location) {
      return res.status(400).json({ success: false, error: 'location is required.' });
    }

    const id = `WO-${Math.floor(1000 + Math.random() * 9000)}`;

    const { rows } = await pool.query(
      `INSERT INTO work_orders
        (id, report_id, defect_id, defect_type, location, lat, lng,
         severity, priority, priority_score, status, contractor,
         target_completion, estimated_cost)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Pending',$11,$12,$13)
       RETURNING *`,
      [
        id, reportId, defectId, defectType, location, lat, lng,
        severity, priority, priorityScore, contractor,
        targetCompletion, estimatedCost
      ]
    );

    res.status(201).json({ success: true, workOrder: rowToWorkOrder(rows[0]) });
  } catch (err) {
    console.error('[WorkOrders POST]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/work-orders/:id — Update status / assign contractor ──────────

router.patch('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }

    const { status, contractor, estimatedCost, targetCompletion } = req.body;

    const { rows } = await pool.query(
      `UPDATE work_orders
       SET
         status            = COALESCE($1, status),
         contractor        = COALESCE($2, contractor),
         estimated_cost    = COALESCE($3, estimated_cost),
         target_completion = COALESCE($4, target_completion),
         updated_at        = NOW()
       WHERE id = $5
       RETURNING *`,
      [status, contractor, estimatedCost, targetCompletion, req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Work order not found.' });
    res.json({ success: true, workOrder: rowToWorkOrder(rows[0]) });
  } catch (err) {
    console.error('[WorkOrders PATCH]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
