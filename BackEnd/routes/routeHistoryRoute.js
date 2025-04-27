const express= require('express');
const { mapHistory } = require('../controllers/routeHistoryController');

const router = express.Router();

router.get('/history/:plateNo/:date', mapHistory);

module.exports = router;