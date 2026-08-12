const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const controller = require("../controllers/recurringExpenseController");

const processRecurringExpenses =
require("../services/recurringExpenseScheduler");

router.post(
    "/",
    protect,
    controller.createRecurringExpense
);

router.get(
    "/",
    protect,
    controller.getRecurringExpenses
);

router.put(
    "/:id",
    protect,
    controller.updateRecurringExpense
);

router.delete(
    "/:id",
    protect,
    controller.deleteRecurringExpense
);

router.patch(
    "/:id/toggle",
    protect,
    controller.toggleRecurringExpense
);

router.get(
    "/history",
    protect,
    controller.getRecurringHistory
);

router.post(
    "/run",
    protect,
    async (req, res) => {

        await processRecurringExpenses();

        res.json({

            success: true,

            message: "Recurring expenses processed."

        });

    }
);

module.exports = router;