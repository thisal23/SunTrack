const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

const getDailySummary = async (req, res) => {
  const { date } = req.query; // Get the date from the query parameter
  console.log("Received date:", date);

  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    const results = await sequelize.query(
      `
      SELECT 
        gd.plateNo AS "vehicleId",
        d.deviceId AS "deviceId",
        MIN(CASE WHEN d.acc = 'on' THEN d.recTime END) AS "firstEngineOnTime",
        MAX(CASE WHEN d.acc = 'off' THEN d.recTime END) AS "lastEngineOffTime",
        TIMEDIFF(
            MAX(CASE WHEN d.acc = 'off' THEN d.recTime END),
            MIN(CASE WHEN d.acc = 'on' THEN d.recTime END)
        ) AS "activeTime"
      FROM 
        gpsdatas d
      JOIN 
        gpsdevices gd ON gd.deviceId = d.deviceId
      WHERE 
        d.recDate = :date  -- Use the dynamic date parameter
        AND d.acc IN ('on', 'off')
      GROUP BY 
        d.deviceId, gd.plateNo;
      `,
      {
        replacements: { date }, // Pass the date dynamically
        type: QueryTypes.SELECT,
      }
    );

    if (results.length === 0) {
      return res.status(404).json({ status: false, message: "Data not found" });
    }

    res.json(results);
    console.log("Daily summary results:", results);
  } catch (error) {
    console.error("Error in daily summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getDailySummary };