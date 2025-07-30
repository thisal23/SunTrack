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
  fetchAvailableVehiclesByDate,
  getTopDrivers,
  getTopVehicles,
  deleteTrip,
  updateTripStatuses,
  updateTrip
} = require("../controllers/tripController");

const router = express.Router();

router.post("/trip/create", createTrip);
router.get("/trip/all", fetchAllTrips);
// router.get("/trip/driver/:id", fetchDriverForTrip);
// router.put("/trip/assign_driver/:id", assignDriver);
// router.put("/trip/assign_vehicle/:id", assignVehicle);
router.get("/trip/count", fetchTripCount);
router.get("/trip/pending", fetchPendingTrips);
router.get('/trip/top-drivers', getTopDrivers);
router.get('/trip/top-vehicles', getTopVehicles);
router.put("/trip/:id", updateTrip);
router.delete("/trip/:id", deleteTrip);

router.post("/trip/:tripId/assign-driver", assignDriver);
router.post("/trip/:tripId/assign-vehicle", assignVehicle);
router.get("/trip/:tripId/available-drivers", fetchDriverForTrip);
router.get("/trip/:tripId/available-vehicles", fetchVehiclesForTrip);
router.get("/available-vehicles", fetchAvailableVehiclesByDate);
router.get("/available-drivers", fetchAvailableDriversByDate);

// Route to update trip statuses automatically
router.post("/trip/update-statuses", updateTripStatuses);

module.exports = router;
