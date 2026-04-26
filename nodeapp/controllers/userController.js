// This file handles the logic for user actions like signing up, logging in, and resetting passwords.
// It talks to the database and sends back responses to the user.

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../authUtils');

// This function handles creating a new user account.
exports.signup = async (req, res) => {
    try {
        const { userName, email, mobile, password, confirmPassword, role, secretQuestionAnswer } = req.body;

        // Check if any field is missing
        if (!userName || !email || !mobile || !password || !confirmPassword || !role || !secretQuestionAnswer) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
                data: {}
            });
        }

        // Validate the username format
        const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (!userNameRegex.test(userName)) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters and contain only alphanumeric characters or underscores.",
                data: {}
            });
        }

        // Validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address.",
                data: {}
            });
        }

        // Validate the mobile number format
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid 10-digit mobile number.",
                data: {}
            });
        }

        // Validate the password strength
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long, include an uppercase letter, a digit, and a special character.",
                data: {}
            });
        }

        // Check if the two passwords entered are the same
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
                data: {}
            });
        }

        // Check if the email is already in our database
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered.",
                data: {}
            });
        }

        // Scramble the password so it's safe to store
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user object
        const newUser = new User({
            userName,
            email,
            mobile,
            password: hashedPassword,
            role,
            secretQuestionAnswer: secretQuestionAnswer
        });

        // Save the user to the database
        await newUser.save();

        // Send a success message
        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            data: {}
        });

    } catch (error) {
        // If something goes wrong with the server
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
            data: {}
        });
    }
};

// This function handles logging in an existing user.
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password.",
                data: {}
            });
        }

        // Look for the user by their email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
                data: {}
            });
        }

        // Check if the entered password matches the one in our database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
                data: {}
            });
        }

        // Create a token that stores user details
        const token = generateToken({
            id: user._id,
            userName: user.userName,
            role: user.role
        });

        // Save the token in a cookie so the browser remembers it
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in real websites
            maxAge: 3600000 // Lasts for 1 hour
        });

        // Send a success message
        res.status(200).json({
            success: true,
            message: "Login successful! Welcome back.",
            data: {
                userName: user.userName,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
            data: {}
        });
    }
};

// This function checks if the user is logged in by verifying their cookie.
// SIMPLIFIED: We just echo back the name and role that are already inside the token!
exports.verifyUser = (req, res) => {
    // The 'validateToken' middleware already verified the user and attached them to req.user
    // So we just send that data straight back to the frontend.
    res.status(200).json({
        success: true,
        message: "User verified from session.",
        data: {
            userName: req.user.userName,
            role: req.user.role
        }
    });
};

// This function handles logging out by clearing the token cookie.
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out successfully.",
        data: {}
    });
};

// This function handles resetting a forgotten password.
exports.forgotPassword = async (req, res) => {
    try {
        const { email, secretQuestionAnswer, newPassword, confirmNewPassword } = req.body;

        // Check if all needed info is sent
        if (!email || !secretQuestionAnswer || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields for password reset.",
                data: {}
            });
        }

        // Validate the new password format
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long, include an uppercase letter, a digit, and a special character.",
                data: {}
            });
        }

        // Check if the two new passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match.",
                data: {}
            });
        }

        // Look for the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email not found.",
                data: {}
            });
        }

        // Check if their answer to the secret question is correct (Case Sensitive)
        if (user.secretQuestionAnswer !== secretQuestionAnswer) {
            return res.status(400).json({
                success: false,
                message: "Incorrect answer to the secret question.",
                data: {}
            });
        }

        // Scramble the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        await user.save();

        // Send a success message
        res.status(200).json({
            success: true,
            message: "Password reset successful! You can now login with your new password.",
            data: {}
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
            data: {}
        });
    }
};