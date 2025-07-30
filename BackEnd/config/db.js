const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables


// Log environment variables to verify they are loaded correctly
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME || "suntrack_meta",
  process.env.DB_USERNAME || "rootadmin",
  process.env.DB_PASSWORD || "root@123", {
  host: process.env.DB_HOST || "62.171.129.214",
  port: process.env.DB_PORT || "3306",
  dialect: 'mysql',
  logging: (sql, queryObject) => {
    // Filter out repetitive geofence check queries
    if (sql.includes('gpsdatas') && sql.includes('ORDER BY') && sql.includes('DESC') && sql.includes('LIMIT 1')) {
      return; // Don't log these repetitive queries
    }
    if (sql.includes('geonames') && sql.includes('SELECT')) {
      return; // Don't log geofence queries
    }
    if (sql.includes('geofenceevents') && sql.includes('ORDER BY') && sql.includes('DESC')) {
      return; // Don't log geofence event queries
    }
    console.log(sql); // Log all other queries
  },

});


sequelize.authenticate().then(() => {
  console.log('database connected');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
module.exports = sequelize;