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

});


sequelize.authenticate().then(() => {
  console.log('database connected');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
module.exports = sequelize;