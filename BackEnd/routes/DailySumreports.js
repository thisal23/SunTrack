const express = require('express');
const router = express.Router();
const { getDailySummary } = require('../controllers/DailySumreports');

router.get('/daily-summary', getDailySummary);

module.exports = router;




