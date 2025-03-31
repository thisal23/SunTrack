const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const geoname = sequelize.define('geoname', {
    geoId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    centerLatitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    centerLongitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    radius: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    length: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {timestamps: false});

module.exports = geoname;