import express from 'express';
import { getAvailableAgents, executeAgentTask } from '../services/agentEngine.js';
import authRoutes     from './auth.js';
import reportsRoutes  from './reports.js';
import complaintsRoutes from './complaints.js';
import workOrdersRoutes from './workorders.js';
import uploadRoutes   from './upload.js';

const router = express.Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ─── Data APIs ────────────────────────────────────────────────────────────────
router.use('/reports',     reportsRoutes);
router.use('/complaints',  complaintsRoutes);
router.use('/work-orders', workOrdersRoutes);
router.use('/upload',      uploadRoutes);

// ─── Health ───────────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({
    status:    'online',
    app:       'ROADNEX Smart City API',
    version:   '2.0.0',
    database:  'PostgreSQL (Neon)',
    timestamp: new Date().toISOString()
  });
});

// ─── Agent Engine ─────────────────────────────────────────────────────────────
router.get('/agents', (req, res) => {
  const agents = getAvailableAgents();
  res.status(200).json({ success: true, count: agents.length, agents });
});

router.post('/run-agent', async (req, res) => {
  try {
    const { agentId, prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ success: false, error: 'Please provide a valid, non-empty prompt.' });
    }
    const result = await executeAgentTask(agentId || 'planner', prompt.trim());
    return res.status(200).json(result);
  } catch (error) {
    console.error('[API Route Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to process agent task: ' + error.message });
  }
});

export default router;
