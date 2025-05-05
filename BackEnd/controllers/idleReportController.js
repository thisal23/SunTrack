const sequelize= require('../config/db');

const getIdleReport = async (req, res) => {
    const {
        date,
        plateNo
    } = req.params;
    console.log(req.params);
    
    try{
        if(!date || !plateNo){
            return res.status(400).json({status:false, message:"Date or PlateNo not found"});
            
        }

       const [idleReport] = await sequelize.query(
        `SELECT 
  gde.plateNo,
  idle.latitude AS idle_latitude,
  idle.longitude AS idle_longitude,
  idle.recTime AS idle_time,
  idle.acc AS idle_acc,
  CONCAT('https://www.google.com/maps?q=', idle.latitude, ',', idle.longitude) AS idle_location_link,
  
  
  move.recTime AS move_time,
  move.acc AS move_acc
FROM gpsdatas idle
JOIN gpsdatas move 
  ON idle.deviceId = move.deviceId 
  AND move.recTime > idle.recTime
  AND move.speed > 0
  AND NOT EXISTS (
      SELECT 1 FROM gpsdatas next_move
      WHERE next_move.deviceId = idle.deviceId
        AND next_move.recTime > idle.recTime
        AND next_move.recTime < move.recTime
        AND next_move.speed > 0
  )
JOIN gpsdevices gde ON idle.deviceId = gde.deviceId
WHERE idle.speed = 0 AND idle.recDate=? AND gde.plateNo =? `, 
            {replacements:[date, plateNo]

            });


            console.log(idleReport);
if(idleReport.length>0){
    return res.status(200).json({status:true , message:"Geo Report fetched" , data:idleReport});
}
else{
    return res.status(400).json({status:false , message:"Data not found"});
}
}
catch(err){
    return res.status(500).json({status:false , message:"Something went wrong"});
}
}

module.exports={
    getIdleReport
}