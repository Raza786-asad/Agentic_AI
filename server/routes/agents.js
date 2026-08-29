/**
 * ROADEX — Dedicated Agents API Routes
 * Endpoints for individual agents and multi-agent pipeline orchestrator
 */

import express from 'express';
import { verifyToken } from './auth.js';
import {
  runOrchestratorPipeline,
  runComplaintAnalysisAgent,
  runRoadDetectionAgent,
  runLocationAgent,
  runPriorityAgent,
  runCitizenVerificationAgent,
  runAuthorityRoutingAgent,
  runNotificationAgent
} from '../services/multiAgentSystem.js';

const router = express.Router();

// ─── POST /api/agents/orchestrate — Full 8-Agent Pipeline ─────────────────────
router.post('/orchestrate', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.description) {
      return res.status(400).json({ success: false, error: 'Complaint description is required for orchestration.' });
    }
    const result = await runOrchestratorPipeline(payload, req.user || null);
    res.status(200).json(result);
  } catch (err) {
    console.error('[POST /api/agents/orchestrate Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/agents/analyze — Complaint Analysis Agent ────────────────────
router.post('/analyze', async (req, res) => {
  try {
    const result = await runComplaintAnalysisAgent(req.body);
    res.status(200).json({ success: true, agent: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/agents/detect — Image / Road Detection Agent ────────────────
router.post('/detect', async (req, res) => {
  try {
    const result = await runRoadDetectionAgent(req.body);
    res.status(200).json({ success: true, agent: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/agents/location — Location Intelligence Agent ────────────────
router.post('/location', async (req, res) => {
  try {
    const result = await runLocationAgent(req.body);
    res.status(200).json({ success: true, agent: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/agents/priority — Priority & Risk Assessment Agent ──────────
router.post('/priority', async (req, res) => {
  try {
    const result = await runPriorityAgent(req.body);
    res.status(200).json({ success: true, agent: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/agents/verify — Citizen Verification Agent ──────────────────
router.post('/verify', async (req, res) => {
  try {
    const result = await runCitizenVerificationAgent(req.body, req.user || null);
    res.status(200).json({ success: true, agent: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/agents/route — Authority Routing Agent ──────────────────────
router.post('/route', async (req, res) => {
  try {
    const result = await runAuthorityRoutingAgent(req.body);
    res.status(200).json({ success: true, agent: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/agents/notify — Notification Agent ──────────────────────────
router.post('/notify', async (req, res) => {
  try {
    const result = await runNotificationAgent(req.body);
    res.status(200).json({ success: true, agent: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/agents/status/:complaintId — Execution Status ─────────────────
router.get('/status/:complaintId', async (req, res) => {
  try {
    const { complaintId } = req.params;
    res.status(200).json({
      success: true,
      complaintId,
      status: 'Completed',
      totalAgents: 8,
      lastExecutedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
