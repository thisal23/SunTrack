const express = require('express');
const router = express.Router();
const { getDriverList,updateDriver,deleteDriver } = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/drivers', authMiddleware, getDriverList);
router.put('/drivers', authMiddleware, updateDriver);
router.delete('/drivers/:id', authMiddleware, deleteDriver);

module.exports = router;
