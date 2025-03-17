const { Trip, TripDetail, User, Vehicle, UserDetail } = require("../models");

//create new trip
const createTrip = async (req, res) => {
  const {
    startLocation,
    endLocation,
    date,
    suggestStartTime,
    suggestEndTime,
    driverStartTime,
    driverEndTime,
    tripRemark,
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
  if (!suggestStartTime || !suggestEndTime) {
    return res
      .status(400)
      .json({ status: false, message: "Suggest start/end time is required!" });
  }

  try {
    const trip = await Trip.create({
      startLocation,
      endLocation,
      date,
      suggestStartTime,
      suggestEndTime,
      status: "pending",
      driverStartTime,
      driverEndTime,
    });

    const tripDetail = await TripDetail.create({
      tripRemark: tripRemark,
      tripId: trip.id,
    });

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
  const { id } = req.params;

  try {
    const tripDetail = await TripDetail.findOne({
      where: {
        tripId: id,
      },
    });
    if (!tripDetail) {
      res.status(404).json({ status: false, message: "Trip detail not found" });
    }

    const data = await tripDetail.update({ driverId });
    if (!data) {
      res.status(500).json({ status: false, message: "Something went wrong" });
    }

    const trip = await Trip.findByPk(id);

    trip.update({ status: "Ready" });
    res.status(200).json({
      status: true,
      message: "Trip detail updated successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

//Assign vehicle for trip
const assignVehicle = async (req, res) => {
  const { vehicleId } = req.body;
  const { id } = req.params;

  try {
    const tripDetail = await TripDetail.findByPk(id);
    if (!tripDetail) {
      res.status(404).json({ status: false, message: "Trip detail not found" });
    }

    const data = await tripDetail.update({ vehicleId });
    if (!data) {
      res.status(500).json({ status: false, message: "Something went wrong" });
    }

    res.status(200).json({
      status: true,
      message: "vehicle assigned successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

const fetchAllTrips = async (req, res) => {
  try {
    const data = await TripDetail.findAll({
      include: [
        {
          model: Trip,
          required: true,
        },
        // {
        //   model: User,
        //   required: false,
        // },
        // {
        //   model: Vehicle,
        //   required: false,
        // },
      ],
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

const fetchDriverForTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByPk(id);

    const typeData = {
      Light: "L",
      Heavy: "H",
      All: "A",
    };

    if (!vehicle) {
      res.status(404).json({ status: true, message: "Data not found" });
    }

    const driverData = await UserDetail.findAll({
      include: [
        {
          model: User,
          required: true,
          where: {
            roleId: 11,
          },
        },
      ],
      where: {
        licenceType: typeData?.[vehicle?.vehicleTypeTwo] || null,
      },
      raw: true,
      nest: true,
    });

    if (!driverData) {
      res.status(404).json({ status: true, message: "Driver data not found" });
    }

    res.status(200).json({
      status: true,
      message: "Data successfully fetch",
      data: driverData,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// 200 - success, 201 - created, 400 -bad request, 404 - not found, 500 - internal server error
// 401 - unauthorized, 403 - forbidden/deny access/Not granted

module.exports = {
  createTrip,
  assignDriver,
  assignVehicle,
  fetchAllTrips,
  fetchDriverForTrip,
};
