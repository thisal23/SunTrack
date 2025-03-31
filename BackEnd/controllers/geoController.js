const { geoname } = require('../models');


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

    

    console.log("received Data" ,req.body);
    try {
        const nameExists = await geoname.findOne({attributes: ['name'] , where: { name } });
        if (nameExists) {
            return res.status(400).json({ status: false, message: "Name already exists!" });
        } 
        const setName = await geoname.create({ name, type, centerLatitude, centerLongitude, radius, width, length });
        if (setName) {
            return res.status(200).json({ status: true, message: "Name added successfully!" });
        } else {
            return res.status(400).json({ status: false, message: "Name not added!" });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: "Something went wrong!", error: err.message });
    }
};

const displayGeoFence = async (req,res) => {
    try{
        const display = await geoname.findAll({
            attributes: ['name', 'type', 'centerLatitude', 'centerLongitude', 'radius', 'width', 'length']
        });
        if(display){
            return res.status(200).json({ status: true, message: "Data fetched successfully!", data: display });
    }
    const data = res.json(res.data);
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
