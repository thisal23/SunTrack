const { gpsdata, geoFenceEvent, geoname } = require('../models');
const geolib = require('geolib');
const sequelize = require('../config/db');


const checkGeofence = async () => {
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
                    

                    break;
                }
            }
            const lastEvent = await geoFenceEvent.findOne({
                where: { deviceId: latest.deviceId },
                order: [['eDate', 'DESC'], ['eTime', 'DESC']],
                raw: true
            });
            console.log("Last Event: ", lastEvent);
            const now = new Date();
            const eTime = now.toTimeString().split(' ')[0];

            if(matchedGeo){
                if(!lastEvent|| lastEvent.eType === 'OUT' || lastEvent.geoId !== matchedGeo.geoId){
                    await geoFenceEvent.create({
                        deviceId: latest.deviceId,
                        geoId: matchedGeo.geoId,
                        eType: 'IN',
                        eDate: now,
                        eTime: eTime
                    });
                    
                }
            }else{
                if(lastEvent && lastEvent.eType === 'IN'){
                    await geoFenceEvent.create({
                        deviceId: latest.deviceId,
                        geoId: lastEvent.geoId,
                        eType: 'OUT',
                        eDate: now,
                        eTime: eTime
                    });
                }
            }


            
        }

    console.log("Geofence check completed successfully.");
    } catch (error) {
        console.error("Geofence check error:", error);
    }
};

module.exports = {
    checkGeofence
};
