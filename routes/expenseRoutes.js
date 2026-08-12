const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const expenseController = require("../controllers/expenseController");

console.log("expenseRoutes loaded");

router.post("/", protect, expenseController.addExpense);

router.get("/", protect, expenseController.getExpenses);

router.put("/:id", protect, expenseController.updateExpense);

router.delete("/:id", protect, expenseController.deleteExpense);

router.get("/summary", protect, expenseController.getExpenseSummary);

router.post("/import", protect, expenseController.importExpenses);

module.exports = router;