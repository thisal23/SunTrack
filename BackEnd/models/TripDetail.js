const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TripDetail = sequelize.define("tripdetail", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tripRemark: {
        type: DataTypes.STRING,
        allowNull: true
    },
    driverRemark: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
            model: "trip",
            key: "id"

        }
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "driverDetail",
            key: "id"
        }
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "vehicle",
            key: "id"
        }
    },

}, { timestamps: true })


module.exports = TripDetail;