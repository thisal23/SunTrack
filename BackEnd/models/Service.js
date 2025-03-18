const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Service = sequelize.define("Service", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    serviceType: {
        type: DataTypes.STRING,
        allowNull: false
    }
})



module.exports = Service;