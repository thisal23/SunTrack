const { Trip, TripDetail, User, Vehicle, driverDetail } = require("../models");

//create new trip
const createTrip = async (req, res) => {
  const {
      startLocation,
      endLocation,
      date,
      suggestStartTime,
      status,
      driverStartTime,
      driverEndTime,
      suggestEndTime,
      tripRemark,
      driverRemark,
      driverId,
      vehicleId,
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
        driverRemark: driverRemark || null,
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
              model: driverDetail,
              as: 'driver',
              required: false,
              include: [
                {
                  model: User,
                  as: 'driverUser',
                  attributes: ['firstName','lastName'], // or firstName, lastName depending on your schema
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
  const detail = trip.tripDetail;
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
    const { id } = req.params;

    const vehicle = await Vehicle.findByPk(id);

    const typeData = {
      Light: "L",
      Heavy: "H",
      All: "A",
    };

    if (!vehicle) {
      return res.status(404).json({ status: true, message: "Vehicle data not found" });
    }

    const driverData = await driverDetail.findAll({
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          where: {
            roleId: 11,
          },
        },
      ],
      where: {
        licenseType: typeData?.[vehicle?.vehicleTypeTwo] || null,
      },
      raw: true,
      nest: true,
    });

    if (!driverData) {
      return res.status(404).json({ status: true, message: "Driver data not found" });
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

//fetchTripCount
const fetchTripCount = async (req,res) => {
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
      return res.tatus(500).json({ error: "Internal server error" });
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

module.exports = {
  createTrip,
  assignDriver,
  assignVehicle,
  fetchAllTrips,
  fetchDriverForTrip,
  fetchTripCount,
  fetchPendingTrips
};
