const express = require('express');
const router = express.Router();
const { getGeoReport } = require('../controllers/geoFenceReportController');

router.get('/reports/:geoFenceName', getGeoReport);

module.exports=router;