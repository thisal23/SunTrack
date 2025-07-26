const express = require("express");
const {
    getLiveTrackingData
} = require("../controllers/liveTrackingController");
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

router.get('/track', authMiddleware , getLiveTrackingData);


module.exports = router;