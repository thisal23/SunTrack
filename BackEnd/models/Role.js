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

// Remove any insertRole function or auto-insert code

module.exports = Role;