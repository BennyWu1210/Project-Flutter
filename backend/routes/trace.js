const express = require('express');
const router = express.Router();

let trace = [];

// Endpoint: Record Trace Action
router.post('/record', (req, res) => {
  const { action, diff, result } = req.body;
  trace.push({ action, diff, result });
  res.json({ status: 'recorded' });
});

// Endpoint: End Session and Return Trace Data
router.post('/end-session', (req, res) => {
  const traceData = JSON.stringify(trace, null, 2);
  trace = []; // Reset trace for the next session
  res.json({ traceData });
});

module.exports = router;
