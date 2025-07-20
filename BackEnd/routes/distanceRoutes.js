const express = require('express');
const router = express.Router();
const distanceController = require('../controllers/distanceController');

router.get('/distance-per-day', distanceController.getDistancePerDay);

module.exports = router;
