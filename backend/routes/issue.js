const express = require('express');
const router = express.Router();
const data = require('../dummyData.json'); // Load dummy data

// Endpoint: Get Random Issue
router.get('/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * data.length);
  const randomIssue = data[randomIndex];
  res.json(randomIssue);
});

module.exports = router;
