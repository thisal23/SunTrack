const express = require("express");
const { createServiceType} = require("../controllers/serviceController");
const router = express.Router();

router.post('/service/create', createServiceType);

module.exports = router;