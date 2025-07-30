const express = require("express");
const {
  createBrand,
  fetchBrands,
  updateBrands,
  deleteBrands,
  createModel,
  fetchModels,
  createVehicle,
  fetchVehicle,
  fetchVehicleById,
  deleteVehicleData,
  updateVehicleById,
  fetchVehicleInfo,
  fetchVehicleCount,
  fetchModelsByBrand,
} = require("../controllers/vehicleController");
const upload = require("../config/multreConfig");
const validateVehicleFields = require("../utils/vehicleDataValidation");
const authMiddleware = require("../middleware/authMiddleware");

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'insuranceDocument', maxCount: 1 },
  { name: 'ecoDocument', maxCount: 1 },
]);

const router = express.Router();
router.post('/vehicle/create', authMiddleware, uploadFields, createVehicle);

// Vehicle Brand routes
router.post("/brand/create", createBrand);
router.get("/brand/all", fetchBrands);
router.put("/brand/update/:id", updateBrands);
router.delete("/brand/destroy/:id", deleteBrands);

// Vehicle Model routes
router.post("/model/create", createModel);
router.get("/model/all", fetchModels);
router.get("/model/brand/:brandId", fetchModelsByBrand);

router.put(
  "/vehicle/update/:id",
  upload.fields([
    { name: "vehicleImage", maxCount: 1 },
    { name: "licenseDocument", maxCount: 1 },
    { name: "insuranceDocument", maxCount: 1 },
    { name: "ecoDocument", maxCount: 1 },
  ]),
  updateVehicleById
);
router.get("/vehicle/all", fetchVehicle);
router.get("/vehicle/details/:id", fetchVehicleById);
router.delete("/vehicle/remove/:plateNo", deleteVehicleData);
router.get("/vehicle/count", fetchVehicleCount);

//vehicleInfo routes
router.get("/vehicleInfo/all", fetchVehicleInfo);

module.exports = router;
