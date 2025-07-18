const express = require("express");
const {
  createTrip,
  createTripDetail,
  assignDriver,
  assignVehicle,
  fetchAllTrips,
  fetchDriverForTrip,
  fetchTripCount,
  fetchPendingTrips,
} = require("../controllers/tripController");

const router = express.Router();

router.post("/trip/create", createTrip);
router.get("/trip/all", fetchAllTrips);
router.get("/trip/driver/:id", fetchDriverForTrip);
router.put("/trip/assign_driver/:id", assignDriver);
router.put("/trip/assign_vehicle/:id", assignVehicle);
router.get("/trip/count", fetchTripCount);
router.get("/trip/pending", fetchPendingTrips)

module.exports = router;
