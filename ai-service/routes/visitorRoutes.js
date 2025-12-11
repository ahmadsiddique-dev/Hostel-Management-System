const express = require('express');
const router = express.Router();
const { handleVisitorQuery } = require('../controllers/visitorController');

// Public Visitor Route (No Auth Required)
router.post('/query', handleVisitorQuery);

// Test Route
router.get('/test', (req, res) => {
  res.json({ message: 'Visitor AI Service is running' });
});

module.exports = router;
