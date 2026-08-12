const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {protect} = require("../middleware/authMiddleware");

router.post("/register", authController.register);

router.post("/login", authController.login);

console.log("protect:", typeof protect);
console.log("getMe:", typeof authController.getMe);

// Protected Test Route
router.get("/me", protect, authController.getMe);

router.put("/profile", protect, authController.updateProfile);

router.post("/forgot-password", authController.forgotPassword);

router.post("/verify-otp", authController.verifyOTP);

router.put("/reset-password", authController.resetPassword);

module.exports = router;