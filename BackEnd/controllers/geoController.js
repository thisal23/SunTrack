const { geoname } = require('../models');
const sequelize = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');


const addGeoFence = async (req, res) => {
    const { 
        name,
        type,
        centerLatitude,
        centerLongitude,
        radius,
        width,
        length
    } = req.body;

    const fleetManagerId = req.user?.id;
    
    const safeWidth = isNaN(width) ? null : width;
    const safeLength = isNaN(length) ? null : length;
    const safeRadius = isNaN(radius) ? null : radius;


    console.log("Fleet Manager ID:", fleetManagerId);
    if (!fleetManagerId) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }
    console.log("received Data" ,req.body);
    try {
        if(type === "circle"){
            if(!radius || radius <= 0){
                return res.status(400).json({ status: false, message: "Radius is required and should be greater than 0!" });
            }
            const nameExists = await geoname.findOne({attributes: ['name'] , where: { name, fleetManagerId } });
            if (nameExists) {
                return res.status(400).json({ status: false, message: "Name already exists!" });
            } 
            const setName = await geoname.create({ name, type, centerLatitude, centerLongitude, radius, safeWidth, safeLength , fleetManagerId });
            if (setName) {
                return res.status(200).json({ status: true, message: "Name added successfully!" });
            } else {
                return res.status(400).json({ status: false, message: "Name not added!" });
            }
        }
        else if(type === "square"){
            if(!width || width <= 0 || !length || length <= 0){
                return res.status(400).json({ status: false, message: "Width and Length are required and should be greater than 0!" });
            }
            const nameExists = await geoname.findOne({attributes: ['name'] , where: { name , fleetManagerId} });
            if (nameExists) {
                return res.status(400).json({ status: false, message: "Name already exists!" });
            } 
            const setName = await geoname.create({ name, type, centerLatitude, centerLongitude, safeRadius, width, length , fleetManagerId });
            if (setName) {
                return res.status(200).json({ status: true, message: "Name added successfully!" });
            } else {
                return res.status(400).json({ status: false, message: "Name not added!" });
            }
        }
        else{
            return res.status(400).json({ status: false, message: "Invalid type! Type should be either circle or rectangle." });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: "Something went wrong!", error: err.message });
    }
};

const displayGeoFence = async (req,res) => {
    try{
        const fleetManagerId = req.user?.id;
        const display = await geoname.findAll({
            attributes: ['name', 'type', 'centerLatitude', 'centerLongitude', 'radius', 'width', 'length'],
            where: { fleetManagerId }
        });
        if(display){
            return res.status(200).json({ status: true, message: "Data fetched successfully!", data: display });
    }
    // const data = res.json(res.data);
    console.log(data);
}
    catch(err){
        return res.status(500).json({ status: false, message: "Something went wrong!", error: err.message });
    }
}

// const checkNameHandler = async (req, res) => {
//     const { name } = req.params;
//     try {
//         const nameExists = await geoname.findOne({ where: { name } });
//         if (nameExists) {
//             return res.status(200).json({ status: true, message: "Name exists!" });
//         } else {
//             return res.status(404).json({ status: false, message: "Name not found!" });
//         }
//     } catch (err) {
//         return res.status(500).json({ status: false, message: "Something went wrong!", error: err.message });
//     }
// };

module.exports = {
    addGeoFence,
    displayGeoFence,
};
