const User = require('./User');
const Role = require('./Role'); // Import the Role model
const UserDetail = require('./UserDetail'); // Import the UserDetail model

// Sachini work imports
const TripDetail = require("./TripDetail");
const Trip = require("./Trip");
const Vehicle = require("./Vehicle");
const VehicleBrand = require("./VehicleBrand");
const VehicleDetail = require("./VehicleDetail");
const ServiceInfo = require("./ServiceInfo");
const Service = require("./Service");

// Define the associations
User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

// User-detail association
UserDetail.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
}); // Define the association


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
  UserDetail,
  Vehicle,
  VehicleBrand,
  VehicleDetail,
  Trip,
  TripDetail,
  Service,
  ServiceInfo,
}; // Export the models