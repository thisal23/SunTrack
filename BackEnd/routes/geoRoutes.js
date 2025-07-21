const express = require('express');
const { addGeoFence, displayGeoFence } = require('../controllers/geoController');

const router = express.Router();


router.post('/geofence/addGeoFence', addGeoFence);
router.get('/geofence/all', displayGeoFence );
module.exports = router;