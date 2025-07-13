const User = require('./User');
const Role = require('./Role');
const DriverDetails = require('./DriverDetails'); // Updated to match DriverDetails.js
const PasswordReset = require('./PasswordReset');

// Sachini work imports
const TripDetail = require("./TripDetail");
const Trip = require("./Trip");
const Vehicle = require("./Vehicle");
const VehicleBrand = require("./VehicleBrand");
const VehicleDetail = require("./VehicleDetail");
const ServiceInfo = require("./ServiceInfo");
const Service = require("./Service");

// Thisal work imports
const geoname = require("./geoname");
const geoFenceEvent = require("./geoFenceEvent");
const gpsdata = require("./gpsdata");

// Define associations
User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

// DriverDetails association
DriverDetails.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
User.hasOne(DriverDetails, {
  foreignKey: 'userId',
  as: 'driverDetails',
});

// PasswordReset association
PasswordReset.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
User.hasMany(PasswordReset, {
  foreignKey: 'userId',
  as: 'passwordResets',
});

geoFenceEvent.belongsTo(geoname, { foreignKey: 'geoId' });
/* ################ Sachini Work ################ */
VehicleDetail.belongsTo(Vehicle, { foreignKey: "vehicleId" });
Vehicle.hasOne(VehicleDetail, { foreignKey: "vehicleId" });

Vehicle.belongsTo(VehicleBrand, { foreignKey: "brandId" });
VehicleBrand.hasMany(Vehicle, { foreignKey: "brandId" });

TripDetail.belongsTo(Trip, { foreignKey: "tripId" });
Trip.hasOne(TripDetail, { foreignKey: "tripId" });

ServiceInfo.belongsTo(Service, { foreignKey: "serviceId" });
Service.hasMany(ServiceInfo, { foreignKey: "serviceId" });

ServiceInfo.belongsTo(Vehicle, { foreignKey: "vehicleId" });
Vehicle.hasMany(ServiceInfo, { foreignKey: "vehicleId" });

ServiceInfo.belongsTo(User, { foreignKey: "userId" });
User.hasMany(ServiceInfo, { foreignKey: "userId" });
/* ################ Sachini Work ################ */

module.exports = {
  User,
  Role,
  DriverDetails,
  PasswordReset,
};