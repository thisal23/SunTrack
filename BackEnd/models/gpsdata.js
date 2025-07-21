const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const gpsdata = sequelize.define('gpsdata', {
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'gpsDevice',
            key: 'deviceId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    recDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    recTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    keyword: {
        type: DataTypes.STRING,
        allowNull: true
    },
    GPS:{ 
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    speed: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    direction: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    acc:{
        type: DataTypes.STRING,
        allowNull: true
    },
    door:{
        type: DataTypes.STRING,
        allowNull: true
    }
}, {tableName: 'gpsdatas', timestamps: false, createdAt: false, id: false,
  updatedAt: false, indexes: [
    {
      unique: true,
      fields: ['deviceId', 'recDate', 'recTime'], // composite unique index works as composite PK
    },
  ],})

module.exports = gpsdata;