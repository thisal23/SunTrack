const {Service, ServiceInfo} = require("../models");

const createServiceType = async (req,res) => {
    const{type} = req.body;

    if(!type){
        return res.status(400).json({status: false, message: "Service type is required!"})
    }

    try {
        const service = await Service.create({serviceType:type});

        if(!service){
            res.status(500).json({status: false, message: "Something went wrong"})
        }

        res.status(201).json({status: true, message: "New service type added"})
    } catch(error){
        res.status(400).json({status: false, message: error.message})
    }
}

module.exports = {createServiceType}