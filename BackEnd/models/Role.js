const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('Role', {
 id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },


}, {
  timestamps: false,
});

module.exports = Role;
// The code above defines a Role model using Sequelize. The Role model has three fields: id, roleName, and displayName. The id field is the primary key and auto-increments. The roleName and displayName fields are of type STRING and cannot be null. The timestamps option is set to false to disable the default timestamps (createdAt and updatedAt) that Sequelize adds to each record.