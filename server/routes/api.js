const express = require('express');
const router = express.Router();
const { getAvailableAgents, executeAgentTask } = require('../services/agentEngine');

/**
 * GET /api/health
 * Server health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Agentic AI Studio',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/agents
 * Returns list of supported agents
 */
router.get('/agents', (req, res) => {
  const agents = getAvailableAgents();
  res.status(200).json({
    success: true,
    count: agents.length,
    agents
  });
});

/**
 * POST /api/run-agent
 * Executes task with specified agent
 */
router.post('/run-agent', async (req, res) => {
  try {
    const { agentId, prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid, non-empty prompt.'
      });
    }

    const result = await executeAgentTask(agentId || 'planner', prompt.trim());
    return res.status(200).json(result);
  } catch (error) {
    console.error('[API Route Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process agent task: ' + error.message
    });
  }
});

module.exports = router;
