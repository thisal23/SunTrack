const User = require('./User');
const Role = require('./Role'); // Import the Role model
const UserDetail = require('./UserDetail'); // Import the UserDetail model

// Sachini work imports
const TripDetail = require("./TripDetail");
const Trip = require("./Trip");
const Vehicle = require("./Vehicle");
const VehicleBrand = require("./VehicleBrand");
const VehicleModel = require("./VehicleModel");
const VehicleDetail = require("./VehicleDetail");
const ServiceInfo = require("./ServiceInfo");
const Service = require("./Service");

// Thisal work imports
const geoname = require("./geoname");
const geoFenceEvent = require("./geoFenceEvent");
const gpsdata = require("./gpsdata");
// Define the associations
User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

// Role has many Users
Role.hasMany(User, {
  foreignKey: 'roleId',
  as: 'users',
});

// User has one UserDetail
User.hasOne(UserDetail, {
  foreignKey: 'userId',
  as: 'detail',
});

// UserDetail belongs to User
UserDetail.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

geoFenceEvent.belongsTo(geoname, {foreignKey: 'geoId'});
/* ################ Sachini Work ################ */
VehicleDetail.belongsTo(Vehicle, { foreignKey: "vehicleId" });
Vehicle.hasOne(VehicleDetail, { foreignKey: "vehicleId" });

Vehicle.belongsTo(VehicleBrand, { foreignKey: "brandId" });
VehicleBrand.hasMany(Vehicle, { foreignKey: "brandId" });

Vehicle.belongsTo(VehicleModel, { foreignKey: "model" });
VehicleModel.hasMany(Vehicle, { foreignKey: "model" });

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
  UserDetail,
  Vehicle,
  VehicleBrand,
  VehicleModel,
  VehicleDetail,
  Trip,
  TripDetail,
  Service,
  ServiceInfo,
  geoname,
  geoFenceEvent,
  gpsdata
}; // Export the models