const express = require('express');     
const {checkGeofence} = require('../controllers/geoFenceEventController');

const router = express.Router();

router.post('/check', checkGeofence);

module.exports = router;