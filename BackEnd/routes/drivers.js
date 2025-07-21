const express = require('express');
const router = express.Router();
const { getDriverList } = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/drivers', authMiddleware, getDriverList);


module.exports = router;
