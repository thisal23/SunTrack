const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  // Add resetPasswordOtp column
  resetPasswordOtp: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Add resetPasswordExpires column
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },

}, {
  timestamps: false,
});

// Hash the user's password before saving it to the database
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;