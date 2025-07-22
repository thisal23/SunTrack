const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
const { User } = require('../models'); // Sequelize model
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
        u.id AS id,
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






const updateDriver = async (req, res) => {
  try {

    console.log('🚨 Incoming Update Body:', req.body);
    const { id, userId, driverUsername, driverName, licenseNo, contactNo } = req.body;

    if (!id || !userId || !driverUsername || !driverName || !licenseNo || !contactNo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Split full name
    const [firstName, ...rest] = driverName.split(' ');
    const lastName = rest.join(' ') || '';

    // ✅ Update `users` table using `id`
    await sequelize.query(
      `UPDATE users 
       SET firstName = :firstName, 
           lastName = :lastName, 
           username = :username, 
           updatedAt = NOW()
       WHERE id = :id`,
      {
        replacements: {
          firstName,
          lastName,
          username: driverUsername,
          id
        },
        type: QueryTypes.UPDATE
      }
    );

    // ✅ Update `driverdetails` table using `userId`
    await sequelize.query(
      `UPDATE driverdetails 
       SET licenseNo = :licenseNo, 
           contactNo = :contactNo
       WHERE userId = :userId`,
      {
        replacements: {
          licenseNo,
          contactNo,
          userId
        },
        type: QueryTypes.UPDATE
      }
    );

    res.json({ message: "Driver updated successfully" });
  } catch (error) {
    console.error("Error in updateDriver:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteDriver = async (req, res) => {
  try {
    const userId = req.params.id;

    await sequelize.query(
      `DELETE FROM driverdetails WHERE userId = :userId`,
      { replacements: { userId }, type: QueryTypes.DELETE }
    );

    await sequelize.query(
      `DELETE FROM users WHERE id = :userId`,
      { replacements: { userId }, type: QueryTypes.DELETE }
    );

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error in deleteDriver:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






















module.exports = { getDriverList,updateDriver, deleteDriver };
