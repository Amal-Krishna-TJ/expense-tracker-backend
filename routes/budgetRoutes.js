const express = require("express");

const router = express.Router();

const { protect } =
    require("../middleware/authMiddleware");

const budgetController =
    require("../controllers/budgetController");

router.post("/", protect, budgetController.createBudget);

router.get("/", protect, budgetController.getBudgets);

router.put("/:id", protect, budgetController.updateBudget);

router.delete("/:id", protect, budgetController.deleteBudget);

module.exports = router;