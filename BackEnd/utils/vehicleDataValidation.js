const validateVehicleFields = (req, res, next) => {
  const {
    vehicleType,
    vehicleTypeTwo,
    brandId,
    vehicleTitle,
    model,
    color,
    licenseId,
    licenseExpireDate,
    licenceLastUpdate,
    insuranceNo,
    insuranceExpireDate,
    insuranceLastUpdate,
    insuranceType,
    chassieNumber,
    fuelType,
    registerYear,
  } = req.body;

  const requiredFields = [
    { field: vehicleType, message: "Vehicle type is required!" },
    { field: vehicleTypeTwo, message: "Vehicle type two is required!" },
    { field: brandId, message: "Brand is required!" },
    { field: model, message: "Model type is required!" },
    { field: vehicleTitle, message: "Vehicle title is required!" },
    { field: color, message: "Color is required!" },
    { field: licenseId, message: "Lisense Id is required!" },
    {
      field: licenseExpireDate,
      message: "License expired date is required!",
    },
    {
      field: licenceLastUpdate,
      message: "License last update date is required!",
    },
    { field: insuranceNo, message: "Insurance no is required!" },
    {
      field: insuranceExpireDate,
      message: "Insurance expire date is required!",
    },
    {
      field: insuranceLastUpdate,
      message: "Insurance last update date is required!",
    },
    { field: insuranceType, message: "Insurance type is required!" },
    { field: chassieNumber, message: "Chassie number is required!" },
    { field: fuelType, message: "Fuel type is required!" },
    { field: registerYear, message: "Register year is required!" },
  ];

  // check the missing fields
  let errors = requiredFields
    .filter(({ field }) => !req.body[field])
    .map(({ message }) => message);

  const currentYear = new Date().getFullYear();
  if (
    !registerYear ||
    isNaN(registerYear) ||
    registerYear < 1900 ||
    registerYear > currentYear
  ) {
    errors.push("Invalid register year!");
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ status: false, message: "Validation Error!!", errors: errors });
  }

  next();
};

module.exports = validateVehicleFields;
