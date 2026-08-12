const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Register User
const register = async (req, res) => {

    try {

        const {
            fullName,
            username,
            email,
            password,
            phone,
            occupation
        } = req.body;

        // Check Email
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check Username
        const usernameExists = await User.findOne({ username });

        if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({

            fullName,
            username,
            email,
            password: hashedPassword,
            phone,
            occupation

        });

        await user.save();

        res.status(201).json({

            success: true,
            message: "Registration Successful"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// Login User
const login = async (req, res) => {

    try {

        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Username or Password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Username or Password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({

            success: true,
            message: "Login Successful",

            token,

            user: {

                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                heroColor: user.heroColor

            }

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// Get logged-in user's complete profile
const getMe = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error("GET PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get user profile"
        });

    }

};

const updateProfile = async (req, res) => {

    try {

        const user = await User.findByIdAndUpdate(

            req.user.id,

            {

                fullName: req.body.fullName,

                username: req.body.username,

                email: req.body.email,

                phone: req.body.phone,

                occupation: req.body.occupation,

                avatar: req.body.avatar,

                heroColor: req.body.heroColor

            },

            {

                new: true

            }

        );

        res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                success: false,

                message: "Email is required."

            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "No account found with this email."

            });

        }

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Save OTP
        user.otp = otp;

        user.otpExpire = new Date(
            Date.now() + 5 * 60 * 1000
        );

        user.otpAttempts = 0;

        user.otpVerified = false;

        await user.save();

        const html = `
            <div style="
                max-width:600px;
                margin:auto;
                font-family:Arial,sans-serif;
                border-radius:12px;
                overflow:hidden;
                border:1px solid #ddd;
            ">

                <div style="
                    background:#003049;
                    color:#fff;
                    padding:20px;
                    text-align:center;
                ">

                    <h2>Expense Tracker</h2>

                </div>

                <div style="padding:30px;">

                    <h3>Password Reset</h3>

                    <p>Your One-Time Password is:</p>

                    <div style="
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:8px;
                        color:#F77F00;
                        text-align:center;
                        margin:25px 0;
                    ">
                        ${otp}
                    </div>

                    <p>
                        This OTP is valid for
                        <strong>5 minutes</strong>.
                    </p>

                    <p>
                        If you didn't request this,
                        simply ignore this email.
                    </p>

                </div>

            </div>
        `;

        await sendEmail(

            user.email,

            "Expense Tracker - Password Reset OTP",

            html

        );

        return res.status(200).json({

            success: true,

            message: "OTP sent successfully."

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (!user.otp || !user.otpExpire) {

            return res.status(400).json({

                success: false,

                message: "No OTP found. Please request a new OTP."

            });

        }

        if (new Date() > user.otpExpire) {

            return res.status(400).json({

                success: false,

                message: "OTP has expired."

            });

        }

        if (user.otp !== otp) {

            user.otpAttempts += 1;

            await user.save();

            if (user.otpAttempts >= 5) {

                user.otp = null;

                user.otpExpire = null;

                user.otpAttempts = 0;

                await user.save();

                return res.status(400).json({

                    success: false,

                    message: "Too many incorrect attempts. Please request a new OTP."

                });

            }

            return res.status(400).json({

                success: false,

                message: "Invalid OTP."

            });

        }

        user.otpVerified = true;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "OTP verified successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const resetPassword = async (req, res) => {

    try {

        const {

            email,

            password,

            confirmPassword

        } = req.body;

        if (

            !email ||

            !password ||

            !confirmPassword

        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }

        if (password !== confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "Passwords do not match."

            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (!user.otpVerified || !user.otpExpire || new Date() > user.otpExpire) {
        
            return res.status(400).json({
            
                success: false,
            
                message: "OTP verification has expired. Please request a new OTP."
            
            });
        
        }

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );

        user.password = hashedPassword;

        // Clear OTP data

        user.otp = null;

        user.otpExpire = null;

        user.otpAttempts = 0;

        user.otpVerified = false;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "Password reset successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {
    register, login, getMe, updateProfile, forgotPassword, verifyOTP, resetPassword
};