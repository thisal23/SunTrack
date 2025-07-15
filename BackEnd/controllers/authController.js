const bcrypt = require('bcrypt'); // Use bcryptjs
const crypto = require('crypto'); 
const sendEmail = require('../utils/sendEmail'); 
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models'); // Ensure correct import
require('dotenv').config(); // Load environment variables

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, roleId, isActive } = req.body;

        console.log("Received Data:", req.body); //  Log received data

        //  Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            roleId,
            isActive
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("Registration Error:", error); // Log full error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login Request Received:", req.body);

        console.log("Searching for user with email:", email);

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log("User Found:", user);

        // Compare provided password with hashed password from DB
        
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Provided:", password); // Log raw password
        console.log("Password Stored in DB:", user.password); // Log stored hashed password
        console.log("Password Match:", isMatch); // Log the comparison result

        if (!isMatch) {
            console.log("Invalid credentials");
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

        // Send email to user about successful login (optional)
        // await sendEmail(user.email, 'Login Successful', 'You have successfully logged in!');

        // Return response with token and user details
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullname: `${user.firstName} ${user.lastName}`,
                email: user.email,
                username: user.userName,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find user by email
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set OTP and expiry in user record
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        await user.save();
        
        // Send email with OTP
        await sendEmail(
            user.email,
            "Password Reset OTP",
            `Your OTP for password reset is: ${otp}\n\nThis OTP expires in 10 minutes.`
        );
        
        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: error.message });
    }
};


// reset password function

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user by email and OTP
        const user = await User.findOne({
            where: {
                email,
                resetPasswordOtp: otp,
                resetPasswordExpires: { [Op.gt]: Date.now() } // Ensure OTP is not expired
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset OTP fields
        user.resetPasswordOtp = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ message: 'Password reset successful. You can now log in with your new password.' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: error.message });
    }
};



