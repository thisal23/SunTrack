const express = require('express');
const { addName, checkNameHandler } = require('../controllers/geoController');

const router = express.Router();

router.get('/geofence/checkName/:name', checkNameHandler);
router.post('/geofence/addName', addName);

module.exports = router;