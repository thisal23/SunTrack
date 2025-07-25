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
          attributes: ['id', 'plateNo'], // Only fetch 'vehicleId' from Vehicle table
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
  const { plateNo } = req.params;
  const {
    documentType,
    lastUpdate,
    expiryDate
  } = req.body;
  const sequelize = VehicleDetail.sequelize;
  const transaction = await sequelize.transaction();
  const documentFile = req.file;

  try {
    // ✅ Step 1: Get vehicle by plateNo
    const vehicle = await Vehicle.findOne({
      where: { plateNo },
      transaction,
    });

    if (!vehicle) {
      await transaction.rollback();
      if (documentFile) {
        fs.unlink(documentFile.path, err => {
          if (err) console.error('Error deleting uploaded file after rollback:', err);
        });
      }
      return res.status(404).json({ status: false, message: "No vehicle found for given plate number." });
    }

    // ✅ Step 2: Get corresponding VehicleDetail by vehicle.id
    const vehicleDetail = await VehicleDetail.findOne({
      where: { vehicleId: vehicle.id },
      transaction,
    });

    if (!vehicleDetail) {
      await transaction.rollback();
      if (documentFile) {
        fs.unlink(documentFile.path, err => {
          if (err) console.error('Error deleting uploaded file after rollback:', err);
        });
      }
      return res.status(404).json({ status: false, message: "Vehicle document details not found for this vehicle." });
    }

    const updateFields = {};
    let oldFilePath = null;

    // ✅ Step 3: Update document-specific fields
    switch (documentType) {
      case 'License':
        updateFields.licenseLastUpdate = lastUpdate || null;
        updateFields.licenseExpireDate = expiryDate || null;
        if (documentFile) {
          oldFilePath = vehicleDetail.licenseDocument;
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
        if (documentFile) {
          fs.unlink(documentFile.path, err => {
            if (err) console.error('Error deleting uploaded file for invalid document type:', err);
          });
        }
        return res.status(400).json({ status: false, message: "Invalid document type provided." });
    }

    // ✅ Step 4: Update VehicleDetail
    await vehicleDetail.update(updateFields, { transaction });
    await transaction.commit();

    // ✅ Step 5: Delete old file if new one is uploaded
    if (documentFile && oldFilePath) {
      const filePathToDelete = oldFilePath.startsWith('/uploads/')
        ? oldFilePath.substring('/uploads/'.length)
        : oldFilePath;
      const fullPathToDelete = path.join(__dirname, '../', 'uploads', filePathToDelete);

      fs.unlink(fullPathToDelete, err => {
        if (err) {
          console.error(`Failed to delete old document file: ${fullPathToDelete}`, err);
        } else {
          console.log(`Old document file deleted: ${fullPathToDelete}`);
        }
      });
    }

    res.status(200).json({
      status: true,
      message: `${documentType} document updated successfully!`,
      data: vehicleDetail,
    });

  } catch (error) {
    await transaction.rollback();
    if (documentFile) {
      fs.unlink(documentFile.path, err => {
        if (err) console.error('Error deleting uploaded file after rollback:', err);
      });
    }
    console.error('Error updating vehicle document details:', error);
    res.status(500).json({
      status: false,
      message: "Failed to update vehicle document details.",
      error: error.message,
    });
  }
};





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
        "insuranceExpireDate",
        "ecoLastUpdate",
        "ecoExpireDate",
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


const getServiceHistory = async (req, res) => {
  const { vehicleId } = req.params;
  if (!vehicleId) {
    return res.status(400).json({ status: false, message: 'Vehicle ID is required' });
  }
  try {
    const history = await ServiceInfo.findAll({
      where: { vehicleId },
      include: [
        { model: Service, as: 'service', attributes: ['serviceType'] },
        { model: User, as: 'user', attributes: ['firstName', 'lastName'] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    const formatted = history.map(h => ({
      serviceType: h.service?.serviceType,
      remark: h.serviceRemark,
      updatedAt: h.updatedAt,
      addedBy: h.user ? `${h.user.firstName} ${h.user.lastName}` : '',
    }));
    res.json({ status: true, data: formatted });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


module.exports = {
  fetchServiceType,
  createServiceType,
  createServiceInfo,
  fetchServiceDetails,
  fetchDocumentDetails,
  updateDocumentDetails,
  getServiceHistory,
};