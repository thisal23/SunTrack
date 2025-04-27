const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const geoFenceEvent = sequelize.define('geofenceevent', {
    eventId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    geoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    
    eType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    eTime: {
        type: DataTypes.TIME,
        allowNull: true
    }
}, {timestamps: true});

module.exports = geoFenceEvent;