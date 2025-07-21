require('dotenv').config();

require('../shedulers/geoFenceSheduler');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const connectDB = require('../config/db'); // Assuming you have a database connection file

const { User, Role, driverDetail, sequelize } = require('../models');

const liveTrackingRoutes = require('../routes/liveTrackingRoutes');
const geoRoutes = require('../routes/geoRoutes');
const geoFenceEventRoutes = require('../routes/geoFenceEventRoutes');
const cors = require("cors");
const { isVehicleInGeoFence } = require('../controllers/geoFenceEventController');
const mapRouteHistory = require('../routes/routeHistoryRoute');
const geoFenceReportRoutes = require('../routes/geoFenceReportRoutes');
const idleReportRoutes = require('../routes/idleReportRoutes');
const vehicleRoutes = require('../routes/vehicleRoutes');
const userRoutes = require('../routes/userRoutes');
const tripRoutes = require('../routes/tripRoutes');
const dailySummaryRoutes = require('../routes/DailySumreports');
const dailydetailRoutes = require('../routes/Dailydetail');
const distanceRoutes = require('../routes/distanceRoutes');
const maintenanceRoutes = require('../routes/maintenanceRoutes')
const driversRoutes = require('../routes/drivers'); // New driver routes


connectDB;


// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend origin
  methods: "GET,POST,PUT,DELETE",  // Allowed HTTP methods
  credentials: true,               // Allow cookies/session handling
  allowedHeaders: "Content-Type,Authorization"
}));

// Define Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api', liveTrackingRoutes);
app.use('/api', geoRoutes);

(async () => {
  try {
    await sequelize.sync(); // Ensure all tables are created
    if (Role.seedRoles) {
      await Role.seedRoles(); // Seed roles after tables exist
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error syncing database or seeding roles:', err);
  }
})();

app.use('/api', maintenanceRoutes)
app.use('/api', userRoutes)
app.use('/api', vehicleRoutes)
app.use('/api', tripRoutes)
app.use('/api', geoFenceEventRoutes);
app.use('/api', mapRouteHistory);
app.use('/api', geoFenceReportRoutes);
app.use('/api', dailySummaryRoutes);
app.use('/api', dailydetailRoutes);
app.use('/api', distanceRoutes);
app.use('/api', idleReportRoutes);
app.use('/api', driversRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

