const express = require("express");
const {
    getLiveTrackingData
} = require("../controllers/liveTrackingController");

const router = express.Router();

router.get('/track', getLiveTrackingData);


module.exports = router;