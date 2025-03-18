const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Trip = sequelize.define("Trip",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    startLocation:{
        type:DataTypes.STRING,
        allowNull:false
    },
    endLocation:{
        type:DataTypes.STRING,
        allowNull:false
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    suggestStartTime:{
        type:DataTypes.TIME,
        allowNull:false
    },
    suggestEndTime:{
        type:DataTypes.TIME,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    driverStartTime:{
        type:DataTypes.TIME,
        allowNull:true
    },
    driverEndTime:{
        type:DataTypes.TIME,
        allowNull:true
    }
},{timestamps:true})

module.exports = Trip;


