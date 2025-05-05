const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

const getDailydetail = async (req, res) => {
    const { startDate, endDate, plateNo } = req.query; // Extract query parameters
    console.log("Received parameters:", { startDate, endDate, plateNo });
  
    // Validate required parameters
    if (!startDate || !endDate || !plateNo) {
      return res.status(400).json({ message: "Start date, end date, and plate number are required" });
    }
  
    try {
      const results = await sequelize.query(
        `SELECT 
          t.id AS tripId,
          t.startLocation,
          t.endLocation,
          t.driverStartTime,
          t.driverEndTime,
          t.date,
          TIMEDIFF(t.driverEndTime, t.driverStartTime) AS duration
        FROM 
          trips t
        JOIN 
          tripdetails td ON t.id = td.tripId
        JOIN 
          vehicledetails vd ON td.vehicleId = vd.vehicleId
        WHERE 
          DATE(t.date) BETWEEN :startDate AND :endDate
          AND vd.plateNo = :plateNo;`,
        {
          replacements: { plateNo, startDate, endDate }, // Pass dynamic values
          type: QueryTypes.SELECT,
        }
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No data found for the given criteria" });
      }
  
      res.json(results);
      console.log("Daily detail results:", results);
    } catch (error) {
      console.error("Error in daily detail:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = { getDailydetail };