const express = require('express');
const router = express.Router();

// Endpoint: Execute Code Simulation
router.post('/execute', (req, res) => {
  // delay to simulate execution time
  setTimeout(() => {
    const randomResult = Math.random() > 0.5 ? 'success' : 'error';
    const consoleMessage = randomResult === 'success' ? '> Successfully deployed shipd to production!' : '> Segmentation fault (core dumped)';
    res.json({ result: randomResult, console: consoleMessage });
  }, 2000);
});

module.exports = router;
