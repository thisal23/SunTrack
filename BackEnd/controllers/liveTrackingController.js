const sequelize = require('../config/db');
const { gpsdata } = require('../models');

const getLiveTrackingData = async (req, res) => {
    try {
        const [liveTrackingData] = await sequelize.query(
            `SELECT 
  g.deviceId, 
  d.plateNo,        
  g.latitude, 
  g.longitude
FROM gpsdatas g
JOIN (
  SELECT deviceId, MAX(CONCAT(recDate, ' ', recTime)) AS max_datetime
  FROM gpsdatas
  GROUP BY deviceId
) latest ON CONCAT(g.recDate, ' ', g.recTime) = latest.max_datetime
       AND g.deviceId = latest.deviceId
JOIN gpsdevices d ON g.deviceId = d.deviceId;
`
        );
        console.log(liveTrackingData);

        if (!liveTrackingData) {
            return res.status(404).json({ status: false, message: "Data not found!" });
        }

        res.status(200).json({ status: true, data: liveTrackingData });
    } catch (err) {
        res.status(500).json({ status: false, message: "Something went wrong!" });
    }
};

module.exports = {
    getLiveTrackingData
};