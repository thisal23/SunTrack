const { Trip, TripDetail, User, Vehicle, DriverDetail, VehicleBrand, VehicleModel } = require("../models");
const { Op } = require("sequelize");
const axios = require('axios');
const sequelize = require('sequelize');

//create new trip
const createTrip = async (req, res) => {
  const {
    startLocation,
    endLocation,
    date,
    status,
    suggestStartTime,
    suggestEndTime,
    tripRemark,
    driverId,
    vehicleId,
    driverStartTime,
    driverEndTime,

  } = req.body;

  if (!startLocation || !endLocation) {
    return res
      .status(400)
      .json({ status: false, message: "Start/End Location is required!" });
  }
  if (!date) {
    return res
      .status(400)
      .json({ status: false, message: "Trip date is required!" });
  }
  if (!suggestStartTime) {
    return res
      .status(400)
      .json({ status: false, message: "Suggest start time is required!" });
  }

  try {
    const trip = await Trip.create(
      {
        startLocation,
        endLocation,
        date,
        suggestStartTime,
        suggestEndTime: suggestEndTime || null,
        status,
        driverStartTime: driverStartTime || null,
        driverEndTime: driverEndTime || null,
      }
    );

    const tripDetail = await TripDetail.create(
      {
        tripId: trip.id,
        tripRemark: tripRemark || null,
        driverId: driverId || null,
        vehicleId: vehicleId || null,
      }
    );

    let array = [trip, tripDetail];

    if (!trip) {
      res.status(500).json({ status: false, message: "Something went wrong" });
    }

    res.status(201).json({
      status: true,
      message: "New trip added successfully",
      data: array,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

//Assign driver for trip
const assignDriver = async (req, res) => {
  const { driverId } = req.body;
  const { id } = req.params; // id = tripId

  try {
    // ✅ Check if the driver exists
    const driver = await DriverDetail.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ status: false, message: "Driver not found" });
    }

    const tripDetail = await TripDetail.findOne({ where: { tripId: id } });
    if (!tripDetail) {
      return res.status(404).json({ status: false, message: "Trip detail not found" });
    }

    const updatedDetail = await tripDetail.update({ driverId });

    // ✅ Also update the trip status
    const trip = await Trip.findByPk(id);
    await trip.update({ status: "Ready" });

    res.status(200).json({
      status: true,
      message: "Driver assigned successfully",
      data: updatedDetail,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

//fetch vehicle for new trips
const fetchAvailableVehiclesByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    const assignedVehicleIds = await TripDetail.findAll({
      include: {
        model: Trip,
        where: { date },
        as: 'trip',
      },
      attributes: ["vehicleId"],
    });

    const unavailable = assignedVehicleIds.map((v) => v.vehicleId);

    const availableVehicles = await Vehicle.findAll({
      where: {
        plateNo: {
          [Op.notIn]: unavailable,
        },
      },
      include: [{
        model: VehicleModel,
        as: 'vehicleModel'
      },
      {
        model: VehicleBrand,
        as: 'vehicleBrand'
      },
      ],
    });

    res.json(availableVehicles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching available vehicles", error: err.message });
  }
};

//fetch drivers fr new trips
const fetchAvailableDriversByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ status: false, message: "Date is required" });
    }

    const assignedDrivers = await TripDetail.findAll({
      include: [
        {
          model: Trip,
          where: { date },
          as: 'trip'
        },
      ],
      where: {
        driverId: {
          [Op.ne]: null,
        },
      },
      attributes: ['driverId'],
    });

    const assignedDriverIds = assignedDrivers.map(d => d.driverId);

    const driverData = await DriverDetail.findAll({
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          where: { roleId: 3 },
        },
      ],
      where: {
        id: {
          [Op.notIn]: assignedDriverIds,
        },
        licenseType: {
          [Op.in]: ["Light", "Heavy", "All"],
        },
      },
      raw: true,
      nest: true,
    });

    res.status(200).json({
      status: true,
      message: "Available drivers fetched successfully",
      data: driverData,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





//Assign vehicle for trip
const assignVehicle = async (req, res) => {
  const { vehicleId } = req.body;
  const { id } = req.params; // id = tripId

  try {
    // Find the plateNo from the vehicle id
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ status: false, message: "Vehicle not found" });
    }

    const plateNo = vehicle.plateNo;

    const tripDetail = await TripDetail.findOne({ where: { tripId: id } });
    if (!tripDetail) {
      return res.status(404).json({ status: false, message: "Trip detail not found" });
    }

    const updatedDetail = await tripDetail.update({ vehicleId: plateNo });

    res.status(200).json({
      status: true,
      message: "Vehicle assigned successfully",
      data: updatedDetail,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};


//fetch all trips
const fetchAllTrips = async (req, res) => {
  try {
    const data = await Trip.findAll({
      include: [
        {
          model: TripDetail,
          as: 'tripDetail',
          required: false,
          include: [
            {
              model: DriverDetail,
              as: 'driver',
              required: false,
              include: [
                {
                  model: User,
                  as: 'driverUser',
                  attributes: ['firstName', 'lastName'], // or firstName, lastName depending on your schema
                  required: false
                }
              ]
            }
          ]
        }
      ]
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ status: true, message: "Data not found" });
    }

    const formatted = data.map(trip => {
      const detail = trip.tripDetail; 20
      const user = detail?.driver?.driverUser;

      const driverName = user ? `${user.firstName} ${user.lastName}` : null;

      return {
        id: trip.id,
        date: trip.date,
        status: trip.status,
        driverName: driverName,
        vehicleId: detail?.vehicleId ?? null,
        tripRemark: detail?.tripRemark ?? null,
        startLocation: trip.startLocation ?? null,
        endLocation: trip.endLocation ?? null,
        suggestStartTime: trip.suggestStartTime ?? null,
        suggestEndTime: trip.suggestEndTime ?? null,
      };
    });


    return res.status(200).json({
      status: true,
      message: "Data successfully fetched",
      data: formatted,
    });

  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};



//fetch driver for trip
const fetchDriverForTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ status: false, message: "Trip not found" });
    }

    // Get already assigned driverIds for the same date
    const assignedDrivers = await TripDetail.findAll({
      include: [
        {
          model: Trip,
          where: { date: trip.date },
          as: 'trip'
        },
      ],
      where: {
        driverId: {
          [Op.ne]: null,
        },
      },
      attributes: ['driverId'],
    });

    const assignedDriverIds = assignedDrivers.map(d => d.driverId);

    const driverData = await DriverDetail.findAll({
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          where: { roleId: 3 }, // Assuming 11 = driver
        },
      ],
      where: {
        id: {
          [Op.notIn]: assignedDriverIds,
        },
        licenseType: {
          [Op.in]: ["Light", "Heavy", "All"], // Adjust based on your vehicle type filtering logic
        },
      },
      raw: true,
      nest: true,
    });

    res.status(200).json({
      status: true,
      message: "Available drivers fetched successfully",
      data: driverData,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


//fetchTripCount
const fetchTripCount = async (req, res) => {
  try {
    const [pending, live, finished] = await Promise.all([
      Trip.count({ where: { status: "pending" } }),
      Trip.count({ where: { status: "live" } }),
      Trip.count({ where: { status: "finished" } }),
    ]);

    return res.json({
      pending,
      live,
      finished,
    });
  } catch (error) {
    console.error("Error fetching trip counts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//fetch vehicles for trip
const fetchVehiclesForTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ status: false, message: "Trip not found" });
    }

    // Find vehicle IDs already assigned for this trip date
    const tripDetailsOnSameDay = await TripDetail.findAll({
      include: [
        {
          model: Trip,
          where: {
            date: trip.date,
          },
          as: 'trip'
        },
      ],
      attributes: ['vehicleId'],
      where: {
        vehicleId: {
          [Op.ne]: null,
        },
      },
    });

    const assignedVehicleIds = tripDetailsOnSameDay.map(td => td.vehicleId);

    const availableVehicles = await Vehicle.findAll({
      where: {
        id: {
          [Op.notIn]: assignedVehicleIds,
        },
        status: 'available',
      },
      include: [
        {
          model: VehicleBrand,
          as: "vehicleBrand",
        },
        {
          model: VehicleModel,
          as: "vehicleModel",
        },
      ],
    });

    return res.status(200).json({
      status: true,
      message: "Available vehicles fetched successfully",
      data: availableVehicles,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


//fetch pending trips
const fetchPendingTrips = async (req, res) => {
  try {
    const data = await Trip.findAll({
      where: {
        status: "pending",
      },
    });

    if (!data || data.length === 0) {
      res.status(404).json({ status: true, message: "Data not found" });
    }

    res.status(200).json({
      status: true,
      message: "Data successfully fetched",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

// Get top drivers by trip count in a period
const getTopDrivers = async (req, res) => {
  try {
    const { period } = req.query;
    // Default: current month
    const now = new Date();
    const start = period === 'all' ? new Date(0) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = period === 'all' ? new Date() : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const results = await TripDetail.findAll({
      where: {
        createdAt: { [Op.between]: [start, end] },
        driverId: { [Op.ne]: null },
      },
      attributes: ['driverId', [sequelize.fn('COUNT', sequelize.col('driverId')), 'tripCount']],
      group: ['driverId'],
      order: [[sequelize.literal('tripCount'), 'DESC']],
      include: [{
        model: DriverDetail,
        as: 'driver',
        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
        attributes: ['id'],
      }],
      limit: 5,
    });
    const topDrivers = results.map(r => ({
      driverId: r.driverId,
      name: r.driver?.user ? `${r.driver.user.firstName} ${r.driver.user.lastName}` : 'Unknown',
      tripCount: r.get('tripCount'),
    }));
    res.json({ status: true, data: topDrivers });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Get top vehicles by trip count in a period
const getTopVehicles = async (req, res) => {
  try {
    const { period } = req.query;
    const now = new Date();
    const start = period === 'all' ? new Date(0) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = period === 'all' ? new Date() : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const results = await TripDetail.findAll({
      where: {
        createdAt: { [Op.between]: [start, end] },
        vehicleId: { [Op.ne]: null },
      },
      attributes: ['vehicleId', [sequelize.fn('COUNT', sequelize.col('vehicleId')), 'tripCount']],
      group: ['vehicleId'],
      order: [[sequelize.literal('tripCount'), 'DESC']],
      include: [{
        model: Vehicle,
        as: 'vehicle',
        include: [
          { model: VehicleBrand, as: 'vehicleBrand', attributes: ['brand'] },
          { model: VehicleModel, as: 'vehicleModel', attributes: ['model'] },
        ],
        attributes: ['id', 'plateNo'],
      }],
      limit: 5,
    });
    const topVehicles = results.map(r => ({
      vehicleId: r.vehicleId,
      plateNo: r.vehicle?.plateNo,
      brand: r.vehicle?.vehicleBrand?.brand,
      model: r.vehicle?.vehicleModel?.model,
      tripCount: r.get('tripCount'),
    }));
    res.json({ status: true, data: topVehicles });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete a trip by ID
const deleteTrip = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ status: false, message: 'Trip ID is required' });
  }
  try {
    // Delete TripDetail first (if exists)
    await TripDetail.destroy({ where: { tripId: id } });
    // Then delete the Trip
    const deleted = await Trip.destroy({ where: { id } });
    if (deleted) {
      return res.status(200).json({ status: true, message: 'Trip deleted successfully' });
    } else {
      return res.status(404).json({ status: false, message: 'Trip not found' });
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createTrip,
  assignDriver,
  assignVehicle,
  fetchAllTrips,
  fetchDriverForTrip,
  fetchVehiclesForTrip,
  fetchTripCount,
  fetchPendingTrips,
  fetchAvailableDriversByDate,
  fetchAvailableVehiclesByDate,
  getTopDrivers,
  getTopVehicles,
  deleteTrip,
};
