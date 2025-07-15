const { Op, sequelize} = require("sequelize");
const {
  Vehicle,
  VehicleDetail,
  VehicleBrand,
  VehicleModel,
  gpsdata,
  gpsDevice,
  TripDetail,
  Trip
} = require("../models");

// Creating new vehicle brands
const createBrand = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ status: false, message: "Brand title is required! (*)" });
  }

  try {
    const brand = await VehicleBrand.create({ title });

    if (!brand) {
      res
        .status(400)
        .json({ status: false, message: "New brand creation failed!!" });
    }

    res.status(201).json({
      status: true,
      message: "New brand creation success",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Fetch all Brands
const fetchBrands = async (req, res) => {
  try {
    const brands = await VehicleBrand.findAll();

    if (!brands) {
      res.status(404).json({ status: false, message: "No brands found" });
    }

    res.status(200).json({ status: true, message: "success", data: brands });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//update vehicle brands
const updateBrands = async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  try {
    // Find brand using params.id
    const data = await VehicleBrand.findByPk(id);

    if (!data) {
      res.status(404).json({ status: false, message: "Brand data not found!" });
    }

    const [updatedRows] = await VehicleBrand.update(
      { title: title },
      {
        where: {
          id: id,
        },
      }
    );

    // checking the data row updated successfully
    if (updatedRows === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Brand data update fail!!" });
    }

    const updatedBrand = await VehicleBrand.findByPk(id);

    res.status(200).json({
      status: true,
      message: "Brand data upated successfully!",
      data: updatedBrand,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//delete vehicle brands
const deleteBrands = async (req, res) => {
  const { id } = req.params;

  //DELETE FROM table_name WHERE condition; delete query eka
  try {
    const brands = await VehicleBrand.destroy({
      where: {
        id: id,
      },
    });

    if (!brands) {
      res.status(404).json({ status: false, message: "No brands data found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Brand data deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

// Creating new vehicle
const createVehicle = async (req, res) => {
  const {
    vehicleType,
    vehicleTypeTwo,
    vehicleTitle,
    modelId,
    color,
    licenseId,
    licenseExpireDate,
    chassieNumber,
    fuelType,
    registerYear,
    licenceLastUpdate,
    insuranceType,
    insuranceNo,
    insuranceExpireDate,
    insuranceLastUpdate,
    brandId,
  } = req.body;

  // if (
  //   !req.files["licenceDocument"] ||
  //   !req.files["insuranceDocument"] ||
  //   !req.files["ecoDocument"]
  // ) {
  //   return res
  //     .status(400)
  //     .json({ status: false, message: "Image and document are required" });
  // }

  const sequelize = Vehicle.sequelize;
  const transaction = await sequelize.transaction();
  // creating data to table
  // `/uploads/${req.files["vehicleImage"][0].filename}`
  // `/uploads/${req.files["licenseDocument"][0].filename}`

  try {
    const vehicle = await Vehicle.create({
      vehicleType,
      vehicleTypeTwo,
      vehicleTitle, 
      image: null,
      brandId,
      modelId,
    });

    const vehicleDetail = await VehicleDetail.create({
      vehicleId: vehicle.id,
      licenseId: licenseId,
      licenseExpireDate: licenseExpireDate,
      insuranceType: insuranceType,
      insuranceNo: insuranceNo,
      insuranceExpireDate: insuranceExpireDate,
      licenceLastUpdate: licenceLastUpdate,
      insuranceLastUpdate: insuranceLastUpdate,
      chassieNumber: chassieNumber,
      fuelType: fuelType,
      registerYear: registerYear,
      color: color,
      licenceDocument: `/uploads/${req.files["licenceDocument"][0].filename}`,
      insuranceDocument: `/uploads/${req.files["insuranceDocument"][0].filename}`,
      ecoDocument: `/uploads/${req.files["ecoDocument"][0].filename}`,
    });

    // const vehicleInfo = await VehicleInfo.create({ vehicleId: vehicle.id, licenceLastUpdate, insuranceLastUpdate });

    let array = [vehicle, vehicleDetail];

    if (!vehicle) {
      res.status(500).json({ status: false, message: "Something went wrong" });
    }

    await transaction.commit();

    res.status(201).json({
      status: true,
      message: "New vehicle added successfully",
      data: array,
    });
  } catch (error) {
    await transaction.rollback();
    res
      .status(400)
      .json({ status: false, message: error.message, stack: error.stack });
  }
};



// Update exist vehicle
const updateVehicleById = async (req, res) => {
  const { id } = req.params; // Get the vehicle ID from the URL params
  const {
    vehicleType,
    vehicleTypeTwo,
    vehicleTitle,
    color,
    licenseId,
    licenseExpireDate,
    chassieNumber,
    fuelType,
    registerYear,
    licenceLastUpdate,
    insuranceType,
    insuranceNo,
    insuranceExpireDate,
    insuranceLastUpdate,
    brandId,
    modelId,
  } = req.body;

  // Check if required files are exist
  // if (
  //   !req.files["vehicleImage"] ||
  //   !req.files["licenceDocument"] ||
  //   !req.files["insuranceDocument"] ||
  //   !req.files["ecoDocument"]
  // ) {
  //   return res
  //     .status(400)
  //     .json({ status: false, message: "Image and document are required" });
  // }

  const sequelize = Vehicle.sequelize;
  const transaction = await sequelize.transaction();

  try {
    // Find the vehicle by ID
    const vehicle = await Vehicle.findByPk(id, { transaction });

    if (!vehicle) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ status: false, message: "Vehicle not found" });
    }

    // Update the Vehicle record
    await vehicle.update(
      {
        vehicleType,
        vehicleTypeTwo,
        vehicleTitle,
        chassieNumber,
        fuelType,
        registerYear,
        color,
        modelId,
        // image: `/uploads/${req.files["vehicleImage"][0].filename}`,
        brandId,
      },
      { transaction }
    );

    // Find the foriegn VehicleDetail record
    const vehicleDetail = await VehicleDetail.findOne({
      where: { vehicleId: id },
      transaction,
    });

    if (!vehicleDetail) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ status: false, message: "Vehicle details not found" });
    }

    // Update the Vehicle Detail record
    await vehicleDetail.update(
      {
        chassieNumber,
        fuelType,
        registerYear,
        color,
        licenseId,
        licenseExpireDate,
        insuranceType,
        insuranceNo,
        insuranceExpireDate,
        licenceLastUpdate,
        insuranceLastUpdate,
        // licenceDocument: `/uploads/${req.files["licenceDocument"][0].filename}`,
        // insuranceDocument: `/uploads/${req.files["insuranceDocument"][0].filename}`,
        // ecoDocument: `/uploads/${req.files["ecoDocument"][0].filename}`,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      status: true,
      message: "Vehicle updated successfully",
      data: { vehicle, vehicleDetail },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      status: false,
      message: error.message,
      stack: error.stack,
    });
  }
};





// Fetch all vehicles with details
const fetchVehicle = async (req, res) => {
  try {
    const data = await Vehicle.findAll({
      attributes: [
        'id', 'brandId', 'vehicleType', 'fuelType', 'category', 'registeredYear', 
        'chassieNo', 'status', 'color', 'image', 'createdAt', 'updatedAt'
      ],
      include: [
        {
          model: VehicleModel,
          as: 'vehicleModel',  // alias must match association
          attributes: ['model']
        },
        {
          model: VehicleBrand,
          as: 'vehicleBrand',
          attributes: ['brand']
        },
        {
          model: VehicleDetail,
          as: 'vehicleDetail',  // alias must match association
          attributes: [
            'licenseId', 'licenceLastUpdate', 'licenseExpireDate', 'licenceDocument',
            'insuranceNo', 'insuranceLastUpdate', 'insuranceExpireDate',
            'insuranceType', 'insuranceDocument', 'ecoId', 'ecoLastUpdate', 'ecoExpireDate', 'ecoDocument'
          ]
        }
      ]
    });

    return res.status(200).json({
      status: true,
      message: "Vehicles data fetched successfully",
      data
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};



// Fetch single vehicle details
const fetchVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Vehicle.findAll({
      include: [
        {
          model: VehicleDetail,
          required: true,
        },
      ],
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });

    if (data.length == 0) {
      res.status(404).json({ status: true, message: "Vehicle data not found" });
    }

    res.status(200).json({
      status: true,
      message: "Vehicle data successfully fetched",
      data: data,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: error.message, stack: error.stack });
  }
};


// Delete vehicle details
const deleteVehicleData = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Vehicle.findByPk(id);

    if (!data) {
      res.status(404).json({ status: true, message: "Vehicle data not found" });
    }

    data.destroy();

    res.status(200).json({
      status: true,
      message: "Vehicle data deleted successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: error.message, stack: error.stack });
  }
};



// Creating new vehicle model
const createModel = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ status: false, message: "Model title is required! (*)" });
  }

  try {
    const model = await VehicleModel.create({ title });

    if (!model) {
      res
        .status(400)
        .json({ status: false, message: "New model creation failed!!" });
    }

    res.status(201).json({
      status: true,
      message: "New model creation success",
      data: model,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



// Fetch all Models
const fetchModels = async (req, res) => {
  try {
    const models = await VehicleModel.findAll();

    if (!models) {
      res.status(404).json({ status: false, message: "No models found" });
    }

    res.status(200).json({ status: true, message: "success", data: models });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//fetchVehicleCount
const fetchVehicleCount = async (req,res) => {
    try {
      const [total,available,outOfService] = await Promise.all([
        Vehicle.count(),
        Vehicle.count({ where: { status: "available" } }),
        Vehicle.count({ where: { status: "outOfService" } }),
      ]);

      return res.json({
        total,
        available,
        outOfService,
      });
    } catch (error) {
      console.error("Error fetching vehicle counts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


//fetch vehicle Info with location name
const axios = require("axios");

const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat,
        lon,
        format: "json",
        addressdetails: 1
      },
      headers: {
        "User-Agent": "SunTrackFleetSystem/1.0 (contact@yourdomain.com)"
      }
    });

    const address = response.data.address;

    // Only use parts you need: street, suburb, city
    const parts = [
      address.road || address.street || "",
      address.suburb || "",
      address.city || address.town || address.village || ""
    ].filter(Boolean);

    return parts.join(", ") || `${lat} | ${lon}`;
  } catch (error) {
    console.error("Reverse geocoding failed:", error.message);
    return `${lat} | ${lon}`;
  }
};

const fetchVehicleInfo = async (req, res) => {
  try {
    // Step 1: Get all vehicles with their GPS devices and trip details
    const vehicles = await Vehicle.findAll({
      attributes: ['id', 'plateNo'],
      include: [
        {
          model: gpsDevice,
          as: 'gpsDevice',
          required: true,
          attributes: ['deviceId']
        },
        {
          model: TripDetail,
          as: 'tripDetails',
          required: false,
          attributes: ['tripId'],
          include: [
            {
              model: Trip,
              as: 'trip',
              attributes: ['endLocation', 'driverStartTime'],
            }
          ],
        }
      ]
    });

    if (!vehicles.length) {
      return res.status(404).json({
        status: false,
        message: "Vehicle data not found"
      });
    }

    const result = [];

    for (const vehicle of vehicles) {
      const deviceId = vehicle.gpsDevice.deviceId;

      // Find latest GPS data
      const latestGpsData = await gpsdata.findOne({
        where: { deviceId },
        order: [['recDate', 'DESC'], ['recTime', 'DESC']],
        attributes: ['deviceId', 'recDate', 'recTime', 'latitude', 'longitude', 'speed', 'direction', 'acc', 'door']
      });

      const tripDetail = vehicle.tripDetails?.[0];
      const tripLocation = tripDetail?.trip?.endLocation || "Null";

      if (latestGpsData) {
        const { latitude, longitude } = latestGpsData;
        const locationName = latitude && longitude
          ? await reverseGeocode(latitude, longitude)
          : "Unknown";

        result.push({
          plateNo: vehicle.plateNo,
          gpsDevice: {
            deviceId: vehicle.gpsDevice.deviceId,
            gpsData: {
              deviceId: latestGpsData.deviceId,
              recDate: latestGpsData.recDate,
              recTime: latestGpsData.recTime,
              latitude,
              longitude,
              speed: latestGpsData.speed,
              direction: latestGpsData.direction,
              acc: latestGpsData.acc,
              door: latestGpsData.door
            }
          },
          tripLocation: tripLocation,
          lastLocation: locationName   // 👈 new field added
        });
      }
    }

    if (!result.length) {
      return res.status(404).json({
        status: false,
        message: "No GPS data found for vehicles"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Vehicle data successfully fetched",
      data: result
    });

  } catch (error) {
    console.error('Error fetching vehicle info:', error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
};






module.exports = {
  createBrand,
  fetchBrands,
  updateBrands,
  deleteBrands,
  createVehicle,
  updateVehicleById,
  fetchVehicle,
  fetchVehicleById,
  deleteVehicleData,
  createModel,
  fetchModels,
  fetchVehicleInfo,
  fetchVehicleCount
};
