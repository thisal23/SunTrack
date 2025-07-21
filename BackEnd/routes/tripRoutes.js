const express = require("express");
const {
  createTrip,
  // createTripDetail,
  assignDriver,
  assignVehicle,
  fetchAllTrips,
  fetchDriverForTrip,
  fetchTripCount,
  fetchPendingTrips,
  fetchVehiclesForTrip,
  fetchAvailableDriversByDate,
  fetchAvailableVehiclesByDate
} = require("../controllers/tripController");

const router = express.Router();

router.post("/trip/create", createTrip);
router.get("/trip/all", fetchAllTrips);
// router.get("/trip/driver/:id", fetchDriverForTrip);
// router.put("/trip/assign_driver/:id", assignDriver);
// router.put("/trip/assign_vehicle/:id", assignVehicle);
router.get("/trip/count", fetchTripCount);
router.get("/trip/pending", fetchPendingTrips);

router.post("/trip/:id/assign-driver", assignDriver);
router.post("/trip/:id/assign-vehicle", assignVehicle);
router.get("/trip/:tripId/available-drivers", fetchDriverForTrip);
router.get("/trip/:tripId/available-vehicles", fetchVehiclesForTrip); 
router.get("/available-vehicles", fetchAvailableVehiclesByDate);
router.get("/available-drivers", fetchAvailableDriversByDate);


module.exports = router;
