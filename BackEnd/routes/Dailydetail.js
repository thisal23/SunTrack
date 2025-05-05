const express = require('express');
const router = express.Router();
const { getDailydetail } = require('../controllers/Dailydetail');

router.get('/daily-detail', getDailydetail);

module.exports = router;