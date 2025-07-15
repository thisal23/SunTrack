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
    plateNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "VehicleBrands",
        key: "id",
      },
    },
    modelId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: "VehicleModels",
        key:"id",
      },
    },
    vehicleType: {
      type: DataTypes.STRING, // Car, Bike, Van
      allowNull: false,
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      // Heavy, Light
      type: DataTypes.STRING,
      allowNull: false,
    },
    registeredYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chassieNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    color:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      // image url saving
      type: DataTypes.STRING(500),
      allowNull: true,
    },  
  },
  { timestamps: true }
);

module.exports = Vehicle;
