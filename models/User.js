const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: ""
    },

    occupation: {
        type: String,
        default: ""
    },

    avatar: {
        type: String,
        default: "MProfile1.png"
    },
    
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    heroColor: {
        type: String,
        default: "#003049"
    },

    otp: {
        type: String,
        default: null
    },

    otpExpire: {
        type: Date,
        default: null
    },

    otpAttempts: {
        type: Number,
        default: 0
    },

    otpVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);