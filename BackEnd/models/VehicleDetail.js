const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VehicleDetail = sequelize.define(
  "VehicleDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Vehicles",
        key: "id",
      },
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licenseId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    licenseExpireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    insuranceType: {
      type: DataTypes.STRING, // Full Insurance - Third Party
      allowNull: false,
    },
    insuranceNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    insuranceExpireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    chassieNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registerYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licenceLastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    insuranceLastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    licenceDocument: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    insuranceDocument: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ecoDocument: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = VehicleDetail;
