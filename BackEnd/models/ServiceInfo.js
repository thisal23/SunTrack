const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const ServiceInfo = sequelize.define("serviceInfo",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    serviceId:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"services",
            key:"id"
        }
    },
    vehicleId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"vehicles",
            key:"id"
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"users",
            key:"id"
        }
    },
    serviceRemark:{
        type: DataTypes.STRING,
        allowNull:true
    }

},{
  tableName: 'serviceinfos',
  timestamps: true
})

module.exports = ServiceInfo;

