const express = require("express");
const { createServiceType, fetchServiceDetails, fetchDocumentDetails, updateDocumentDetails, fetchServiceType, updateServiceDetails} = require("../controllers/maintenanceController");
const router = express.Router();
const upload = require("../config/multreConfig"); // Or your custom config


router.post('/service/create', createServiceType);
router.get('/service/serviceType/all', fetchServiceType);
router.get('/service/detailFetch', fetchServiceDetails);
router.post('/service/update/:licenseId', updateServiceDetails)
router.get('/document/detailFetch', fetchDocumentDetails);
router.put('/document/update/:licenseId', upload.single("document"), updateDocumentDetails);

module.exports = router;