const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VehicleBrand = sequelize.define("VehicleBrand", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
},{timestamps: true});

module.exports = VehicleBrand;

// Create - Done, Read - Done, Update, Delete