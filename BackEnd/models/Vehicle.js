const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vehicleType: {
      type: DataTypes.STRING, // Car, Bike, Van
      allowNull: false,
    },
    vehicleTypeTwo: {
      // Heavy, Light
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleTitle: {
      // Toyota Corolla
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      // 2021, 2022, 2023 - Laurel Spirit / X5 / z5
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      // image url saving
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "VehicleBrands",
        key: "id",
      },
    },
  },
  { timestamps: true }
);

module.exports = Vehicle;
