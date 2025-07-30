const express = require("express");
const { createServiceType, fetchServiceDetails, fetchDocumentDetails, updateDocumentDetails, fetchServiceType, updateServiceDetails, createServiceInfo, getServiceHistory, fetchServiceTypesByVehicle, deleteLastServiceRecord, getVehiclesWithoutServices } = require("../controllers/maintenanceController");
const router = express.Router();
const upload = require("../config/multreConfig"); // Or your custom config
const authMiddleware = require("../middleware/authMiddleware");

router.post('/service/type_create', createServiceType);
router.get('/service/serviceType/all', fetchServiceType);
router.get('/service/serviceType/vehicle/:vehicleId', fetchServiceTypesByVehicle);
router.get('/service/vehicles-without-services', getVehiclesWithoutServices);
router.delete('/service/vehicle/:vehicleId/serviceType/:serviceTypeId', deleteLastServiceRecord);
router.get('/service/detailFetch', fetchServiceDetails);
router.post('/service/create', authMiddleware, createServiceInfo);
router.get('/document/detailFetch', fetchDocumentDetails);
router.put('/document/update/:plateNo', upload.single("document"), updateDocumentDetails);
router.get('/service/history/:vehicleId', getServiceHistory);

module.exports = router;