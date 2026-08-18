const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {protect} = require("../middleware/authMiddleware");

const {
    getAuthUrl,
    getTokens
} = require("../services/gmailOAuth");

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

router.get(
    "/google",
    (req, res) => {

        const authUrl =
            getAuthUrl();

        res.redirect(authUrl);

    }
);


router.get(
    "/google/callback",
    async (req, res) => {

        try {

            const { code } = req.query;

            if (!code) {

                return res.status(400).send(
                    "Authorization code missing."
                );

            }

            const tokens =
                await getTokens(code);

            console.log(
                "GOOGLE TOKENS RECEIVED:"
            );

            console.log(tokens);

            res.send(`
                <h2>Gmail authorization successful!</h2>
                <p>You can close this window.</p>
                <p>Check your Render logs for the refresh token.</p>
            `);

        } catch (error) {

            console.error(
                "GOOGLE OAUTH ERROR:",
                error
            );

            res.status(500).send(
                "Google authorization failed."
            );

        }

    }
);

module.exports = router;