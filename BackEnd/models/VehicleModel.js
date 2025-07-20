const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VehicleModel = sequelize.define("vehiclemodel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, { timestamps: true });

module.exports = VehicleModel;