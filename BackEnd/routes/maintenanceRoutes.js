const express = require("express");
const { createServiceType, fetchServiceDetails, fetchDocumentDetails, updateDocumentDetails, fetchServiceType, updateServiceDetails, createServiceInfo} = require("../controllers/maintenanceController");
const router = express.Router();
const upload = require("../config/multreConfig"); // Or your custom config


router.post('/service/create', createServiceType);
router.get('/service/serviceType/all', fetchServiceType);
router.get('/service/detailFetch', fetchServiceDetails);
router.post('/service/create', createServiceInfo);
router.get('/document/detailFetch', fetchDocumentDetails);
router.put('/document/update/:licenseId', upload.single("document"), updateDocumentDetails);

module.exports = router;


// PORT=8000
// DB_HOST=62.171.129.214
// DB_NAME=suntrack_meta
// DB_USERNAME=rootadmin
// DB_PASSWORD=root@123
// DB_PORT=3306
// JWT_SECRET=supersecretkey