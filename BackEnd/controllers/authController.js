const bcrypt = require('bcrypt'); // ✅ Use bcryptjs
const crypto = require('crypto'); 
const sendEmail = require('../utils/sendEmail'); 
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // ✅ Ensure correct import
require('dotenv').config(); // ✅ Load environment variables

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, roleId, isActive } = req.body;

        console.log("Received Data:", req.body); // ✅ Log received data

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        

        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password,
            roleId,
            isActive
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("Registration Error:", error); // ✅ Log full error
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


// forgot password function (working)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a secure token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Set token and expiry in user record
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        

        // Construct the password reset URL
        const resetUrl = `http://yourfrontend.com/reset-password?token=${resetToken}&email=${email}`;

        // Send email
        await sendEmail(
            user.email,
            "Password Reset Request",
            `Click the link to reset your password: ${resetUrl}\n\nThis link expires in 10 minutes.`
        );

        res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// // forgot password function 3


// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     console.log("Generated Token:", resetToken); // Debugging

//     // Hash token before storing
//     const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     console.log("Hashed Token:", hashedToken); // Debugging

//     // Set expiry time (1 hour from now)
//     const expiryTime = Date.now() + 3600000;
//     console.log("Expiry Time:", expiryTime); // Debugging

//     // Save token and expiry to database
//     user.resetToken = hashedToken;
//     user.resetTokenExpiry = expiryTime;

//     await user.save();
//     console.log("Token saved successfully in database");

//     // Send the reset token to the user's email (send plain token, not hashed)
//     sendResetEmail(user.email, resetToken);

//     res.json({ message: "Reset token sent to email" });
//   } catch (error) {
//     console.error("Error saving token:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// // forgot password function2

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Generate token and hash it before storing
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

//     // Save the hashed token in the database with an expiry time
//     user.resetToken = hashedToken;
//     user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
//     await user.save();

//     // Send the reset token to the user's email (not hashed version)
//     sendResetEmail(user.email, resetToken);

//     res.json({ message: "Reset token sent to email" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };



// reset password function

exports.resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;

        // Find user by email and reset token
        // const user = await User.findOne({
        //     where: {
        //         email,
        //         resetPasswordToken: token,
        //         resetPasswordExpires: { $gt: Date.now() } // Ensure token is not expired
        //     }
        // });
        const { Op } = require("sequelize");

        const user = await User.findOne({
        where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: Date.now() } // ✅ Correct way in Sequelize
    }
});


        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token fields
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ message: 'Password reset successful. You can now log in with your new password.' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: error.message });
    }
};



