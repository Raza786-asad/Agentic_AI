import express from 'express';
import { getAvailableAgents, executeAgentTask, executeMultiAgentPipeline } from '../services/agentEngine.js';
import authRoutes     from './auth.js';
import reportsRoutes  from './reports.js';
import complaintsRoutes from './complaints.js';
import workOrdersRoutes from './workorders.js';
import uploadRoutes   from './upload.js';
import agentsRoutes   from './agents.js';

const router = express.Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ─── Data APIs ────────────────────────────────────────────────────────────────
router.use('/reports',     reportsRoutes);
router.use('/complaints',  complaintsRoutes);
router.use('/work-orders', workOrdersRoutes);
router.use('/upload',      uploadRoutes);
router.use('/agents',      agentsRoutes);

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

// ─── Agent Engine & Multi-Agent Orchestrator ──────────────────────────────────
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
    const result = await executeAgentTask(agentId || 'vision', prompt.trim());
    return res.status(200).json(result);
  } catch (error) {
    console.error('[API Route Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to process agent task: ' + error.message });
  }
});

router.post('/run-pipeline', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ success: false, error: 'Please provide a valid prompt for the multi-agent pipeline.' });
    }
    const result = await executeMultiAgentPipeline(prompt.trim());
    return res.status(200).json(result);
  } catch (error) {
    console.error('[API Pipeline Error]:', error);
    return res.status(500).json({ success: false, error: 'Failed to process pipeline: ' + error.message });
  }
});

export default router;
