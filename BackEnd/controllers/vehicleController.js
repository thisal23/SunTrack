const { Op, sequelize } = require("sequelize");
const axios = require("axios");
const jwt = require("jsonwebtoken");
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
  const { brand } = req.body;

  if (!brand) {
    return res
      .status(400)
      .json({ status: false, message: "Brand title is required!" });
  }

  try {
    const createdBrand = await VehicleBrand.create({ brand });

    if (createdBrand) {
      return res.status(201).json({
        status: true,
        message: "New brand creation success",
        data: createdBrand,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Brand creation failed!",
      });
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: false,
        message: "Brand already exists",
      });
    }

    console.error("Error creating brand:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// Fetch all Brands
const fetchBrands = async (req, res) => {
  try {
    console.log('Fetching brands...');

    const brands = await VehicleBrand.findAll();

    console.log('Brands found:', brands.length);

    res.status(200).json({ status: true, message: "success", data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
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
  // Debug: Log request information
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  console.log('Request headers:', req.headers['content-type']);
  console.log('Files keys:', req.files ? Object.keys(req.files) : 'No files');

  const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), process.env.JWT_SECRET || `fea72bbf58b952d502f3386a8a59b4b29dfe0f98b8a15be5e9de5e2eb763d980`);
  const userId = decoded.id;

  // Log each file if present
  if (req.files) {
    Object.keys(req.files).forEach(key => {
      console.log(`File ${key}:`, req.files[key][0] ? {
        filename: req.files[key][0].filename,
        originalname: req.files[key][0].originalname,
        mimetype: req.files[key][0].mimetype,
        size: req.files[key][0].size
      } : 'No file');
    });
  }

  const {
    plateNo,
    brandId,
    modelId,
    vehicleType,
    category,
    fuelType,
    registeredYear,
    chassieNo,
    status,
    color,

    licenseId,
    licenseLastUpdate,
    licenseExpireDate,
    licenseDocument,

    insuranceNo,
    insuranceLastUpdate,
    insuranceExpireDate,
    insuranceType,
    insuranceDocument,

    ecoId,
    ecoLastUpdate,
    ecoExpireDate,
    ecoDocument,

    deviceId,
    countrycode,
    pnumber,
    fleetManagerId,
  } = req.body;

  // Debug: Log what files are received
  console.log('=== VEHICLE CREATE DEBUG ===');
  console.log('req.files:', req.files);
  console.log('req.files keys:', req.files ? Object.keys(req.files) : 'No files');
  if (req.files) {
    Object.keys(req.files).forEach(key => {
      console.log(`File ${key}:`, req.files[key][0] ? {
        filename: req.files[key][0].filename,
        originalname: req.files[key][0].originalname,
        mimetype: req.files[key][0].mimetype,
        size: req.files[key][0].size
      } : 'No file');
    });
  }
  console.log('=== END DEBUG ===');

  // Check if req.files exists and contains the required documents
  if (!req.files ||
    !req.files["licenseDocument"] ||
    !req.files["insuranceDocument"] ||
    !req.files["ecoDocument"]
  ) {
    console.log('Missing files:');
    console.log('- req.files exists:', !!req.files);
    console.log('- licenseDocument exists:', !!(req.files && req.files["licenseDocument"]));
    console.log('- insuranceDocument exists:', !!(req.files && req.files["insuranceDocument"]));
    console.log('- ecoDocument exists:', !!(req.files && req.files["ecoDocument"]));

    return res.status(400).json({
      status: false,
      message: "Required documents missing. Please upload license, insurance, and eco documents."
    });
  }

  const sequelize = Vehicle.sequelize;
  const transaction = await sequelize.transaction();

  try {
    // Create Vehicle
    const vehicle = await Vehicle.create({
      plateNo,
      brandId,
      modelId,
      vehicleType,
      category,
      fuelType,
      registeredYear,
      chassieNo,
      status: `available`,
      color,
    }, { transaction });

    // Create Vehicle Details
    const vehicleDetail = await VehicleDetail.create({
      vehicleId: vehicle.id,
      licenseId,
      licenseLastUpdate,
      licenseExpireDate,
      licenseDocument: req.files && req.files["licenseDocument"] ? `/uploads/${req.files["licenseDocument"][0].filename}` : null,
      insuranceNo,
      insuranceLastUpdate,
      insuranceExpireDate,
      insuranceType,
      insuranceDocument: req.files && req.files["insuranceDocument"] ? `/uploads/${req.files["insuranceDocument"][0].filename}` : null,
      ecoId,
      ecoLastUpdate,
      ecoExpireDate,
      ecoDocument: req.files && req.files["ecoDocument"] ? `/uploads/${req.files["ecoDocument"][0].filename}` : null,
    }, { transaction });

    // Create GPS Device info
    const gpsDeviceData = await gpsDevice.create({
      deviceId,
      plateNo,        // Should match vehicle plateNo
      countrycode,
      pnumber,
      fleetManagerId: userId,
    }, { transaction });


    await transaction.commit();
    res.status(201).json({
      status: true,
      message: "Vehicle, details, and GPS device created successfully",
      data: { vehicle, vehicleDetail, gpsDeviceData },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ status: false, message: error.message, error: error, });
  }
};




const updateVehicleById = async (req, res) => {
  const { id } = req.params;

  const {
    plateNo,
    brandId,
    modelId,
    vehicleType,
    category,
    fuelType,
    registeredYear,
    chassieNo,
    status,
    color,

    deviceId,
    countrycode,
    pnumber,
  } = req.body;

  const sequelize = Vehicle.sequelize;
  const transaction = await sequelize.transaction();

  try {
    const vehicle = await Vehicle.findByPk(id, { transaction });

    if (!vehicle) {
      await transaction.rollback();
      return res.status(404).json({ status: false, message: "Vehicle not found" });
    }

    await vehicle.update(
      {
        plateNo,
        brandId,
        modelId,
        vehicleType,
        category,
        fuelType,
        registeredYear,
        chassieNo,
        status,
        color,
        ...(req.files["image"] && {
          image: `/uploads/${req.files["image"][0].filename}`,
        }),
      },
      { transaction }
    );

    // Try to fetch GPS device
    let gpsData = await gpsDevice.findOne({
      where: { plateNo: plateNo.trim() },
      transaction,
    });

    if (gpsData) {
      await gpsData.update(
        {
          deviceId,
          countrycode,
          pnumber,
        },
        { transaction }
      );
    } else {
      // No GPS data found, assign null
      gpsData = null;
    }

    await transaction.commit();

    return res.status(200).json({
      status: true,
      message: gpsData
        ? "Vehicle and GPS updated successfully"
        : "Vehicle updated; GPS device not found",
      data: { vehicle, gpsData }, // gpsData will be null if not found
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(400).json({
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
        'id',
        'plateNo',
        'brandId',
        'vehicleType',
        'fuelType',
        'category',
        'registeredYear',
        'chassieNo',
        'status',
        'color',
        'image',
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
            'licenseId', 'licenseLastUpdate', 'licenseExpireDate', 'licenseDocument',
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



const fetchVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findOne({
      where: { id },
      include: [
        {
          model: gpsDevice,
          as: "gpsDevice", // must match association alias
          required: false, // allow null
        },
      ],
    });

    if (!vehicle) {
      return res.status(404).json({ status: false, message: "Vehicle data not found" });
    }

    res.status(200).json({
      status: true,
      message: "Vehicle data successfully fetched",
      data: vehicle,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message, stack: error.stack });
  }
};



const deleteVehicleData = async (req, res) => {
  try {
    const { plateNo } = req.params;

    // Find the vehicle
    const vehicle = await Vehicle.findOne({ where: { plateNo } });

    if (!vehicle) {
      return res.status(404).json({ status: false, message: "Vehicle data not found" });
    }

    // Find all GPS devices linked to this vehicle
    const gpsDevices = await gpsDevice.findAll({ where: { plateNo } });

    for (const device of gpsDevices) {
      // Delete all GPS data related to this device
      // Since gpsdatas has composite PK (deviceId, recDate, recTime), we must delete all rows by deviceId
      // We can delete all rows for this deviceId without specifying recDate and recTime (bulk delete)
      await sequelize.query(
        'DELETE FROM gpsdatas WHERE deviceId = :deviceId',
        {
          replacements: { deviceId: device.deviceId },
          type: sequelize.QueryTypes.DELETE
        }
      );


      // Delete the GPS device itself
      await device.destroy();
    }

    // Delete the vehicle
    await vehicle.destroy();

    res.status(200).json({
      status: true,
      message: "Vehicle and related GPS data deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// Creating new vehicle model
const createModel = async (req, res) => {
  const { model, brandId } = req.body;

  if (!model) {
    return res
      .status(400)
      .json({ status: false, message: "Model title is required!" });
  }

  if (!brandId) {
    return res
      .status(400)
      .json({ status: false, message: "Brand ID is required!" });
  }

  try {
    const createdModel = await VehicleModel.create({ model, brandId });

    if (createdModel) {
      return res.status(201).json({
        status: true,
        message: "New model creation success",
        data: createdModel,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Model creation failed!",
      });
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: false,
        message: "Model already exists",
      });
    }

    console.error("Error creating model:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};


// Fetch all Models
const fetchModels = async (req, res) => {
  try {
    console.log('Fetching models...');

    const models = await VehicleModel.findAll({
      include: [
        {
          model: VehicleBrand,
          as: 'brand',
          attributes: ['id', 'brand']
        }
      ]
    });

    console.log('Models found:', models.length);

    res.status(200).json({ status: true, message: "success", data: models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Fetch models by brand ID
const fetchModelsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    console.log('Fetching models for brand ID:', brandId);

    const models = await VehicleModel.findAll({
      where: { brandId: brandId },
      include: [
        {
          model: VehicleBrand,
          as: 'brand',
          attributes: ['id', 'brand']
        }
      ]
    });

    console.log('Models found for brand:', models.length);

    res.status(200).json({ status: true, message: "success", data: models });
  } catch (error) {
    console.error('Error fetching models by brand:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

//fetchVehicleCount
const fetchVehicleCount = async (req, res) => {
  try {
    const [total, available, outOfService] = await Promise.all([
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






// Test function to check models in database
const testModels = async (req, res) => {
  try {
    console.log('Testing models...');

    // Check if VehicleModel table exists and has data
    const modelCount = await VehicleModel.count();
    console.log('Total models in database:', modelCount);

    // Get all models without associations
    const allModels = await VehicleModel.findAll({
      raw: true
    });
    console.log('All models:', allModels);

    res.status(200).json({
      status: true,
      message: "Model test completed",
      data: {
        count: modelCount,
        models: allModels
      }
    });
  } catch (error) {
    console.error('Error testing models:', error);
    res.status(500).json({ status: false, message: error.message });
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
  fetchModelsByBrand,
  testModels,
  fetchVehicleInfo,
  fetchVehicleCount
};
