const express = require("express");

const router = express.Router();

const {

    getDashboard,

    getUsers,

    deleteUser,

    getAnalytics

} = require("../controllers/adminController");

const { protect } =
require("../middleware/authMiddleware");

router.get(
    "/dashboard",
    protect,
    getDashboard
);

router.get(
    "/users",
    protect,
    getUsers
);

router.delete(
    "/users/:id",
    protect,
    deleteUser
);

router.get(
    "/analytics",
    protect,
    getAnalytics
);

module.exports = router;