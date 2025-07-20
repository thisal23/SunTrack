const {checkGeofence} = require('../controllers/geoFenceEventController');

setInterval(checkGeofence, 100*1000);