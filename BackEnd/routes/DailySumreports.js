const express = require('express');
const router = express.Router();
const { getDailySummary } = require('../controllers/DailySumreports');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/DailySumreports', authMiddleware, getDailySummary);

module.exports = router;




