const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, verifyOtp,createPassword } = require('../controllers/authController');

// Define the routes and their corresponding controller functions
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-otp', verifyOtp);
router.post('/create-password', createPassword);

module.exports = router;