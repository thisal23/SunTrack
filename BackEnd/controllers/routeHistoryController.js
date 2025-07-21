const sequelize = require('../config/db');
const {gpsdata} = require('../models');

const mapHistory = async (req, res) => {
    
    const {
        plateNo ,
        date } = req.params;

        console.log(req.params);
    try {
        if(!plateNo || !date){
            return res.status(400).json({status:false, message:"device or date not found"});
        }
        const [mapRoute] = await sequelize.query(`SELECT gd.deviceId, gd.recDate, gd.recTime, gd.latitude, gd.longitude, gde.plateNo FROM gpsdatas gd , gpsdevices gde WHERE gd.deviceId = gde.deviceId && gde.plateNo = ? AND gd.recDate = ? ORDER BY gd.recTime ASC;`, {replacements:[plateNo , date]});
        console.log(mapRoute);

        if(mapRoute.length>0){
            return res.status(200).json({status:true , message:"route data fetched" , data:mapRoute});
        }
        else{
            return res.status(400).json({status:false , message:"Data not found"});
        }


    }
    catch{
        return res.status(500).json({status:false , message:"Something went wrong"});
    }

}

module.exports={
    mapHistory
}