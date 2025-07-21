const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

// Get all drivers assigned to the current logged-in fleet manager
const getDriverList = async (req, res) => {
  try {
    
  
     const fleetManagerId = req.user?.id;

  if (!fleetManagerId) {
  return res.status(401).json({ message: "Unauthorized: Fleet Manager ID missing" });
}


    // Run the SQL query to get driver list
    const results = await sequelize.query(
      `SELECT 
        fm.id AS fleetManagerId,
        CONCAT(fm.firstName, ' ', fm.lastName) AS fleetManagerName,
        d.id AS driverId,
        u.username AS driverUsername,
        CONCAT(u.firstName, ' ', u.lastName) AS driverName,
        d.licenseNo,
        d.contactNo
      FROM 
        driverdetails d
      JOIN users u ON d.userId = u.id
      JOIN users fm ON d.fleetManagerId = fm.id
      WHERE 
        d.fleetManagerId = :fleetManagerId
        AND u.roleId = 3
        AND fm.roleId = 2
      ORDER BY
        d.id`,
      {
        replacements: { fleetManagerId },
        type: QueryTypes.SELECT,
      }
    );

    // If no drivers found
    if (results.length === 0) {
      return res.status(404).json({ message: "No drivers found for this fleet manager" });
    }

    // Return driver list
    res.json(results);
    console.log("Drivers list result:", results);
  } catch (error) {
    console.error("Error in getDriverList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getDriverList };
