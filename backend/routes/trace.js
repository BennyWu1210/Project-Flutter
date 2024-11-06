const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Initialize trace and issue information (in-memory since there's no db)
let trace = [];
let issueDetails = {};

// ============= Helper functions =============
function resetTrace() {
  trace = [];
  issueDetails = {};
}

function saveTraceToFile(traceData, issueId) {
  const filePath = path.join(__dirname, `../traces/trace_${issueId}.json`);
  console.log(filePath);
  fs.writeFileSync(filePath, JSON.stringify(traceData, null, 2), 'utf8');
}


// Endpoint: Start recording session
router.post('/start-session', (req, res) => {
  const { issue, initial_code } = req.body;
  issueDetails = {
    issue,
    initial_code,
    pull_request: "<code>",  // Placeholder for now; can be set later when needed 
    actions: []
  };
  console.log("session started");
  res.json({ status: 'session_started' });
});


// Endpoint: Record trace action
router.post('/record', (req, res) => {
  const { action, diff, execution_result } = req.body;
  console.log(req.body)
  const actionDetails = { action, diff };

  // Add execution result if available (only for "execute_code" actions)
  if (execution_result) {
    actionDetails.execution_result = execution_result;
  }

  console.log(trace);
  // Add action to the trace and issueDetails
  trace.push(actionDetails);
  issueDetails.actions.push(actionDetails);
  
  res.json({ status: 'recorded' });
});


// Endpoint: End recording session and save trace to File
router.post('/end-session', (req, res) => {
  const { pull_request } = req.body;
  
  issueDetails.pull_request = pull_request;

  saveTraceToFile(issueDetails, Date.now());

  // Respond with the saved trace data
  res.json({ traceData: issueDetails });

  resetTrace();
});

module.exports = router;
