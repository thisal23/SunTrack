const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VehicleBrand = sequelize.define("vehiclebrand", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }

}, { timestamps: true });


module.exports = VehicleBrand;