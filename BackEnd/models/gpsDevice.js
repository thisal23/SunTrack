const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const gpsDevice = sequelize.define('GpsDevice', {
  deviceId: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    allowNull: false,
  },
  plateNo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'vehicles', // or 'VehicleDetails' if you're referencing that table
      key: 'plateNo',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL', // you can use CASCADE or RESTRICT as needed
  },
  countrycode: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  pnumber: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  fleetManagerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },

}, {
  tableName: 'gpsdevices',
  timestamps: false, // remove this if you don't have createdAt/updatedAt
});

module.exports = gpsDevice;
