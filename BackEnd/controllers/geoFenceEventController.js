const { gpsdata, geoFenceEvent, geoname } = require('../models');
const geolib = require('geolib');
const sequelize = require('../config/db');


const checkGeofence = async (req, res) => {
    try {
        
        const latestLocations = await gpsdata.findAll({
            attributes: [
                'deviceId', 
                'recDate' ,               'recTime',
                'keyword', 'GPS',
                'latitude', 'longitude', 'speed', 'direction', 'acc', 'door'
              ],
            
            order: [['recDate', 'DESC'], ['recTime', 'DESC']],
            group: ['deviceId', 'recDate', 'recTime'],
            
            
            raw: true
        });
        console.log("Latest Locations: ", latestLocations);
        for (let loc of latestLocations) {
            const latest = await gpsdata.findOne({
                where: { deviceId: loc.deviceId,  },
                attributes: [
                    'deviceId', 
                    'recDate' ,               'recTime',
                    'keyword', 'GPS',
                    'latitude', 'longitude', 'speed', 'direction', 'acc', 'door'
                  ],
                order: [
                    ['recDate', 'DESC'],
                    ['recTime', 'DESC']
                  ]
            });

            const fences = await geoname.findAll();
            let matchedGeo = null;

            for (let fence of fences) {
                const isInside = geolib.isPointWithinRadius(
                    { latitude: latest.latitude, longitude: latest.longitude },
                    { latitude: fence.centerLatitude, longitude: fence.centerLongitude },
                    fence.radius
                );
                if (isInside) {
                    matchedGeo = fence;
                    const now = new Date();
                    const eTime = now.toTimeString().split(' ')[0];
                    await geoFenceEvent.create({
                        deviceId: latest.deviceId,
                        geoId: matchedGeo ? matchedGeo.geoId : null,
                        eType: matchedGeo ? 'IN' : 'OUT',
                        eDate: new Date(),
                        eTime: eTime
                    });
                    break;
                }
            }

            
        }

        return res.status(200).json({ status: true, message: "Geofence check completed." });

    } catch (error) {
        console.error("Geofence check error:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

module.exports = {
    checkGeofence
};
