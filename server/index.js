const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRoutes);

// Serve static frontend assets from Vite build directory if it exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to dist/index.html for SPA routing
app.get('*', (req, res) => {
  if (require('fs').existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.json({
      message: 'Agentic AI Studio API Server is running.',
      frontendDevUrl: 'http://localhost:3000',
      apiHealth: `http://localhost:${PORT}/api/health`
    });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`
  ======================================================
  🚀 AGENTIC AI STUDIO - EXPRESS API SERVER
  ======================================================
  ▸ API Base URL:  http://localhost:${PORT}/api
  ▸ Health Check:  http://localhost:${PORT}/api/health
  ▸ Vite Frontend: http://localhost:3000
  ======================================================
  `);
});
