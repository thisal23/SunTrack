const sequelize = require('../config/db');

const getGeoReport = async (req, res) => {
    const {
        geoFenceName
    } = req.params;
    console.log(geoFenceName);

    try {
        if (!geoFenceName) {
            return res.status(400).json({ status: false, message: "GeoFence name not found" });
        }

        const [geoReport] = await sequelize.query(
            `WITH filtered_events AS (SELECT ge.deviceId,gd.plateNo,ge.geoId,ge.eType,ge.eDate,ge.eTime,g.name,ROW_NUMBER() OVER (PARTITION BY ge.deviceId, ge.eType ORDER BY ge.eDate, ge.eTime) AS rn FROM geofenceevents ge JOIN 
        gpsdevices gd ON ge.deviceId = gd.deviceId
            JOIN 
            geonames g ON ge.geoId = g.geoId
            WHERE 
                g.name = ?
            AND ge.eType IN ('IN', 'OUT')
            ),

            first_in AS (
                SELECT * FROM filtered_events
                WHERE eType = 'IN' AND rn = 1
            ),

            first_out AS (
                SELECT * FROM filtered_events
                WHERE eType = 'OUT' AND rn = 1
            )

            SELECT i.plateNo,i.eDate AS InDate,TIME_FORMAT(i.eTime, '%H:%i') AS InTime,o.eDate AS OutDate,TIME_FORMAT(o.eTime, '%H:%i') AS OutTime
            FROM first_in i LEFT JOIN first_out o ON i.deviceId = o.deviceId
            ORDER BY i.deviceId;`,
            {
                replacements: [geoFenceName]

            });


        // console.log(geoReport);
        if (geoReport.length > 0) {
            return res.status(200).json({ status: true, message: "Geo Report fetched", data: geoReport });
        }
        else {
            return res.status(400).json({ status: false, message: "Data not found" });
        }
    }
    catch (err) {
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
}

module.exports = {
    getGeoReport
}