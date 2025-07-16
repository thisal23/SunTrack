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
    licenseId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    licenseLastUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    licenseExpireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    licenseDocument: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    insuranceNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    insuranceLastUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    insuranceExpireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    insuranceType: {
      type: DataTypes.STRING, // Full Insurance, Third Party
      allowNull: false,
    },
    insuranceDocument: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ecoId:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ecoLastUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ecoExpireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ecoDocument: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = VehicleDetail;
