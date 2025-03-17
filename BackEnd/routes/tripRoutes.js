const express = require("express");
const {
  createTrip,
  createTripDetail,
  assignDriver,
  assignVehicle,
  fetchAllTrips,
  fetchDriverForTrip,
} = require("../controllers/tripController");

const router = express.Router();

router.post("/trip/create", createTrip);
router.get("/trip/all", fetchAllTrips);
router.get("/trip/driver/:id", fetchDriverForTrip);
router.put("/trip/assign_driver/:id", assignDriver); // assign-driver // assign_driver
// router.post('/tripdetail/create',createTripDetail)
router.put("/trip/assign_vehicle/:id", assignVehicle);

module.exports = router;
