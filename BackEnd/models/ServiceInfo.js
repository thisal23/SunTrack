const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const ServiceInfo = sequelize.define("ServiceInfo",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    serviceId:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"Services",
            key:"id"
        }
    },
    vehicleId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"Vehicles",
            key:"id"
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"Users",
            key:"id"
        }
    },
    serviceRemark:{
        type: DataTypes.STRING,
        allowNull:true
    }

},{timestamps:true})

module.exports = ServiceInfo;

