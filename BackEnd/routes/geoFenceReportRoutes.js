const express = require('express');
const router = express.Router();
const { getGeoReport } = require('../controllers/geoFenceReportController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/reports',authMiddleware, getGeoReport);

module.exports=router;