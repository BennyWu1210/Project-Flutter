const express = require('express');
const router = express.Router();

// Endpoint: Execute Code Simulation
router.post('/execute', (req, res) => {
  const randomResult = Math.random() > 0.5 ? 'success' : 'error';
  // make the following messages super funny and creative (related to CS kids memes)
  const consoleMessage = randomResult === 'success' ? '> Successfully deployed shipd to production!' : '> Segmentation fault (core dumped)';
  res.json({ result: randomResult, console: consoleMessage });
});

module.exports = router;
