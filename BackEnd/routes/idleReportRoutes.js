const express = require('express');
const router = express.Router();

const { getIdleReport } = require('../controllers/idleReportController');

router.get('/idle/:date/:plateNo', getIdleReport);

module.exports = router;