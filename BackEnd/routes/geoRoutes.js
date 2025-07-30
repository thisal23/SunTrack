const express = require('express');
const { addGeoFence, displayGeoFence } = require('../controllers/geoController');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 


router.post('/geofence/addGeoFence',authMiddleware, addGeoFence);
router.get('/geofence/all', authMiddleware , displayGeoFence );
module.exports = router;