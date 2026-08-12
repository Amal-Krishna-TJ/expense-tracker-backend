const express = require("express");

const router =
    express.Router();

const { protect } =
    require("../middleware/authMiddleware");

const controller =
    require("../controllers/notificationController");

router.get(
    "/",
    protect,
    controller.getNotifications
);

module.exports = router;