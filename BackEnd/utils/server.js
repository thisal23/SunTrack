require('dotenv').config();

require('../shedulers/geoFenceSheduler');
const express = require('express');
const connectDB = require('../config/db'); // Assuming you have a database connection file
const { User, Role, UserDetail } = require('../models');
const liveTrackingRoutes = require('../routes/liveTrackingRoutes');
const geoRoutes = require('../routes/geoRoutes');
const geoFenceEventRoutes = require('../routes/geoFenceEventRoutes');
const cors = require("cors");
const { isVehicleInGeoFence } = require('../controllers/geoFenceEventController');
const mapRouteHistory = require('../routes/routeHistoryRoute');
const geoFenceReportRoutes = require('../routes/geoFenceReportRoutes');
const idleReportRoutes = require('../routes/idleReportRoutes');

const app = express();
const PORT = process.env.PORT || 8000;
const dailySummaryRoutes = require('../routes/DailySumreports');
const dailydetailRoutes = require('../routes/Dailydetail');
const distanceRoutes = require('../routes/distanceRoutes');
connectDB;


// Init Middleware
app.use(express.json({ extended: false }));
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
app.use('/api',geoFenceEventRoutes);
app.use('/api',mapRouteHistory);
app.use('/api',geoFenceReportRoutes);
app.use('/api',dailySummaryRoutes);
app.use('/api',dailydetailRoutes);
app.use('/api', distanceRoutes);
app.use('/api', idleReportRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
