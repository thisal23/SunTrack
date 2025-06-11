const express = require("express");
const { createServiceType, fetchServiceDetails, fetchDocumentDetails, updateDocumentDetails} = require("../controllers/maintenanceController");
const router = express.Router();
const upload = require("../config/multreConfig"); // Or your custom config


router.post('/service/create', createServiceType);
router.get('/service/detailFetch', fetchServiceDetails);
router.get('/document/detailFetch', fetchDocumentDetails);
router.put('/document/update/:licenseId', upload.single("document"), updateDocumentDetails);

module.exports = router;