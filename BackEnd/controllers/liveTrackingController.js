const sequelize = require('../config/db');
const { gpsdata } = require('../models');

const getLiveTrackingData = async (req, res) => {
    try {
        const [liveTrackingData, metadata] = await sequelize.query(
            "SELECT deviceId, latitude, longitude FROM gpsdatas ORDER BY recDate DESC, recTime DESC LIMIT 1;"
        );
        // console.log(liveTrackingData);

        if (!liveTrackingData) {
            return res.status(404).json({ status: false, message: "Data not found!" });
        }

        res.status(200).json({ status: true, data: liveTrackingData[0] });
    } catch (err) {
        res.status(500).json({ status: false, message: "Something went wrong!" });
    }
};

module.exports = {
    getLiveTrackingData
};