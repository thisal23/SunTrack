const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const gpsdata = sequelize.define('gpsdata', {
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
        primaryKey: true
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
}, {tableName: 'gpsdatas', timestamps: false})

module.exports = gpsdata;