const express = require("express");

const router = express.Router();

const { protect } =
    require("../middleware/authMiddleware");

const categoryController =
    require("../controllers/categoryController");


router.get(
    "/",
    protect,
    categoryController.getCategories
);


router.post(
    "/",
    protect,
    categoryController.addCategory
);


module.exports = router;