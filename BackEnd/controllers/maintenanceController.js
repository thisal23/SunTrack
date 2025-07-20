const { Service, ServiceInfo, Vehicle, User, VehicleDetail } = require("../models");
const fs = require('fs');
const path = require('path');

// Fetch service Types
const fetchServiceType = async (req, res) => {
  try {
    const serviceType = await Service.findAll();

    if (!serviceType) {
      res.status(404).json({ status: false, message: "No Service Types found" });
    }

    res.status(200).json({ status: true, message: "success", data: serviceType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


//create service type
const createServiceType = async (req, res) => {
  const { type } = req.body;

  if (!type) {
    return res.status(400).json({ status: false, message: "Service type 2 is required!" })
  }

  try {
    const service = await service.create({ serviceType: type });

    if (!service) {
      res.status(500).json({ status: false, message: "Something went wrong" })
    }

    res.status(201).json({ status: true, message: "New service type added" })
  } catch (error) {
    res.status(400).json({ status: false, message: error.message })
  }
}





const fetchServiceDetails = async (req, res) => {
  try {
    const serviceInfo = await ServiceInfo.findAll({
      include: [
        {
          model: Service,
          attributes: ['serviceType'], // Only fetch 'name' from Service table
          required: true,
        },
        {
          model: User,
          attributes: ['firstName', 'lastName'], // Only fetch 'username' from User table
          required: true,
        },
        {
          model: Vehicle,
          attributes: ['id'], // Only fetch 'vehicleId' from Vehicle table
          required: true,
        },
      ],
    });

    if (!serviceInfo) {
      res.status(404).json({ status: false, message: "No service details found" });
    }
    res.status(200).json({ status: true, message: "Success", data: serviceInfo });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message })
  }
}


//update existing document record
const updateDocumentDetails = async (req, res) => {
  const { id } = req.params;
  const {
    documentType,
    lastUpdate,
    expiryDate
  } = req.body;
  const sequelize = VehicleDetail.sequelize; // Get sequelize instance from any model
  const transaction = await sequelize.transaction();
  const documentFile = req.file; // multer uploaded file info

  try {
    const vehicleDetail = await VehicleDetail.findOne({
      where: { id },
      transaction,
    });

    if (!vehicleDetail) {
      await transaction.rollback();
      // If a file was uploaded but no vehicleDetail found, delete the uploaded file
      if (documentFile) {
        fs.unlink(documentFile.path, (err) => {
          if (err) console.error('Error deleting uploaded file after rollback:', err);
        });
      }
      return res.status(404).json({ status: false, message: "Vehicle document details not found for the given license ID." });
    }

    const updateFields = {};
    let oldFilePath = null; // To store path of old document file for deletion

    // Conditionally update fields based on documentType
    switch (documentType) {
      case 'License':
        updateFields.licenseLastUpdate = lastUpdate || null;
        updateFields.licenseExpireDate = expiryDate || null;
        if (documentFile) {
          oldFilePath = vehicleDetail.licenseDocument; // Get old path
          updateFields.licenseDocument = `/uploads/documents/${documentFile.filename}`;
        }
        break;
      case 'Insurance':
        updateFields.insuranceLastUpdate = lastUpdate || null;
        updateFields.insuranceExpireDate = expiryDate || null;
        if (documentFile) {
          oldFilePath = vehicleDetail.insuranceDocument;
          updateFields.insuranceDocument = `/uploads/documents/${documentFile.filename}`;
        }
        break;
      case 'Eco Test':
        updateFields.ecoLastUpdate = lastUpdate || null;
        updateFields.ecoExpireDate = expiryDate || null;
        if (documentFile) {
          oldFilePath = vehicleDetail.ecoDocument;
          updateFields.ecoDocument = `/uploads/documents/${documentFile.filename}`;
        }
        break;
      default:
        await transaction.rollback();
        if (documentFile) { // Delete uploaded file if document type is invalid
          fs.unlink(documentFile.path, (err) => {
            if (err) console.error('Error deleting uploaded file for invalid document type:', err);
          });
        }
        return res.status(400).json({ status: false, message: "Invalid document type provided." });
    }

    // Update the VehicleDetail record within the transaction
    await vehicleDetail.update(updateFields, { transaction });

    await transaction.commit();

    // If a new file was uploaded AND there was an old file, delete the old file AFTER successful commit
    if (documentFile && oldFilePath) {
      // Remove '/uploads/' prefix if it's stored in the DB this way
      const filePathToDelete = oldFilePath.startsWith('/uploads/') ? oldFilePath.substring('/uploads/'.length) : oldFilePath;
      const fullPathToDelete = path.join(__dirname, '../', 'uploads', filePathToDelete); // Adjust path as needed

      fs.unlink(fullPathToDelete, (err) => {
        if (err) {
          // Log the error but don't stop the response as update was successful
          console.error(`Failed to delete old document file: ${fullPathToDelete}`, err);
        } else {
          console.log(`Old document file deleted: ${fullPathToDelete}`);
        }
      });
    }

    res.status(200).json({
      status: true,
      message: `${documentType} document updated successfully!`,
      data: vehicleDetail, // Return the updated vehicleDetail
    });

  } catch (error) {
    await transaction.rollback();
    // If an error occurred and a file was uploaded, delete it
    if (documentFile) {
      fs.unlink(documentFile.path, (err) => {
        if (err) console.error('Error deleting uploaded file after rollback:', err);
      });
    }
    console.error('Error updating vehicle document details:', error);
    res.status(500).json({ // Use 500 for server-side errors
      status: false,
      message: "Failed to update vehicle document details.",
      error: error.message,
      stack: error.stack // Include stack for debugging in development, remove in production
    });
  }
}




const fetchDocumentDetails = async (req, res) => {
  try {
    const documentInfo = await VehicleDetail.findAll({
      attributes: [
        "id",
        "licenseId",
        "licenseDocument",
        "insuranceDocument",
        "ecoDocument",
        "licenseLastUpdate",
        "licenseExpireDate",
        "insuranceLastUpdate",
        "insuranceExpireDate"
      ],
      include: [
        {
          model: Vehicle,
          attributes: ['plateNo'],
          as: 'vehicle'
        }
      ]
    });

    if (!documentInfo || documentInfo.length === 0) {
      return res.status(404).json({ status: false, message: "No document details found" });
    }

    res.status(200).json({ status: true, message: "Success", data: documentInfo });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const createServiceInfo = async (req, res) => {
  const { serviceType, remark, addedBy, vehicleId } = req.body;

  if (!serviceType || !vehicleId) {
    return res.status(400).json({
      status: false,
      message: "Service type, vehicle ID, and user ID are required!",
    });
  }

  try {
    const serviceInfo = await ServiceInfo.create({
      serviceId: serviceType,
      vehicleId: vehicleId,
      userId: addedBy || null,
      serviceRemark: remark || null,
    });

    if (!serviceInfo) {
      return res
        .status(500)
        .json({ status: false, message: "Something went wrong" });
    }

    return res
      .status(201)
      .json({ status: true, message: "Service info added successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: error.message });
  }
};



module.exports = {
  fetchServiceType,
  createServiceType,
  createServiceInfo,
  fetchServiceDetails,
  fetchDocumentDetails,
  updateDocumentDetails,
};