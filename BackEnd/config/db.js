const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables


// Log environment variables to verify they are loaded correctly
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  
});


sequelize.authenticate().then(() => {
  console.log('database connected');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
module.exports = sequelize;