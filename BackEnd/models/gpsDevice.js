const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const gpsDevice = sequelize.define('gpsdevice', {
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    plateNo: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'vehicles',
            key: 'plateNo'
        }
    },
    countrycode:{
        type: DataTypes.STRING,
        allowNull: false
    },
    pnumber:{
        type: DataTypes.STRING,
        allowNull: false
    },
    
}, {tableName: 'gpsdevices', timestamps: false})

module.exports = gpsDevice;