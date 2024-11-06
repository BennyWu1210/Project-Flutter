const express = require('express');
const router = express.Router();
const data = require('../dummyData.json'); // Load dummy data

// Endpoint: Get random repository from dummy data
router.get('/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * data.length);
  const randomRepo = data[randomIndex];
  res.json(randomRepo);
});


module.exports = router;
