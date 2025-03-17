const { Op } = require("sequelize");
const {
  Vehicle,
  VehicleDetail,
  VehicleInfo,
  VehicleBrand,
  VehicleModel,
} = require("../models");

// 200 - success, 201 - created, 400 -bad request, 404 - not found, 500 - internal server error
// 401 - unauthorized, 403 - forbidden/deny access/Not granted

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

    // CREATE INTO table_name (title) VALUES (title)

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

    // SELECT * FROM VehicleBrands

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
    model,
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

  if (
    !req.files["licenceDocument"] ||
    !req.files["insuranceDocument"] ||
    !req.files["ecoDocument"]
  ) {
    return res
      .status(400)
      .json({ status: false, message: "Image and document are required" });
  }

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
      model,
      image: null,
      brandId,
    });

    const vehicleDetail = await VehicleDetail.create({
      vehicleId: vehicle.id,
      color: color,
      licenseId: licenseId,
      licenseExpireDate: licenseExpireDate,
      insuranceType: insuranceType,
      insuranceNo: insuranceNo,
      insuranceExpireDate: insuranceExpireDate,
      chassieNumber: chassieNumber,
      fuelType: fuelType,
      registerYear: registerYear,
      licenceLastUpdate: licenceLastUpdate,
      insuranceLastUpdate: insuranceLastUpdate,
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

// Udpate exist vehicle
const updateVehicleById = async (req, res) => {
  const { id } = req.params; // Get the vehicle ID from the URL params
  const {
    vehicleType,
    vehicleTypeTwo,
    vehicleTitle,
    model,
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

  // Check if required files are exist
  if (
    !req.files["vehicleImage"] ||
    !req.files["licenceDocument"] ||
    !req.files["insuranceDocument"] ||
    !req.files["ecoDocument"]
  ) {
    return res
      .status(400)
      .json({ status: false, message: "Image and document are required" });
  }

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
        model,
        image: `/uploads/${req.files["vehicleImage"][0].filename}`,
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

    // Update the VehicleDetail record
    await vehicleDetail.update(
      {
        color,
        licenseId,
        licenseExpireDate,
        insuranceType,
        insuranceNo,
        insuranceExpireDate,
        chassieNumber,
        fuelType,
        registerYear,
        licenceLastUpdate,
        insuranceLastUpdate,
        licenceDocument: `/uploads/${req.files["licenceDocument"][0].filename}`,
        insuranceDocument: `/uploads/${req.files["insuranceDocument"][0].filename}`,
        ecoDocument: `/uploads/${req.files["ecoDocument"][0].filename}`,
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
      include: [
        {
          model: VehicleDetail,
          required: true,
        },
        {
          model: VehicleBrand,
          required: true,
        },
      ],
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
};
