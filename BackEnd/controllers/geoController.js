const { geoname } = require('../models');


const addName = async (req, res) => {
    const { name } = req.body;
    console.log(req.body);
    try {
        const nameExists = await geoname.findOne({ where: { name } });
        if (nameExists) {
            return res.status(400).json({ status: false, message: "Name already exists!" });
        } 
        const setName = await geoname.create({ name });
        if (setName) {
            return res.status(200).json({ status: true, message: "Name added successfully!" });
        } else {
            return res.status(400).json({ status: false, message: "Name not added!" });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: "Something went wrong!", error: err.message });
    }
};


const checkNameHandler = async (req, res) => {
    const { name } = req.params;
    try {
        const nameExists = await geoname.findOne({ where: { name } });
        if (nameExists) {
            return res.status(200).json({ status: true, message: "Name exists!" });
        } else {
            return res.status(404).json({ status: false, message: "Name not found!" });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: "Something went wrong!", error: err.message });
    }
};

module.exports = {
    addName,
    checkNameHandler,
};
