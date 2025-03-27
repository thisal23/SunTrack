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
    }
}, {timestamps: false});

module.exports = geoname;