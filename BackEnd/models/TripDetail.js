const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TripDetail = sequelize.define("TripDetail",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    tripRemark:{
        type:DataTypes.STRING,
        allowNull:true
    },
    driverRemark:{
        type:DataTypes.STRING,
        allowNull:true
    },
    tripId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"Trips",
            key:"id"
        }
    },
    driverId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        // references:{
        //     model:"Driver",
        //     key:"id"
        // }
    },
    vehicleId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        // references:{
        //     model:"Vehicles",
        //     key:"id",
        //     constraints: false
        // },
        
    },
},{timestamps:true})

module.exports = TripDetail;