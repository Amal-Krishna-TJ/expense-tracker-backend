const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

//CREATE Budget
exports.createBudget = async (req, res) => {

    try {

        const { category, month, year } = req.body;

        const existingBudget = await Budget.findOne({

            user: req.user.id,

            category,

            month,

            year

        });

        if (existingBudget) {

            return res.status(400).json({

                message: "A budget already exists for this category, month and year."

            });

        }

        const budget = await Budget.create({

            user: req.user.id,

            category,

            amount: req.body.amount,

            month,

            year

        });

        res.status(201).json(budget);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

//GET Budget
exports.getBudgets = async (req, res) => {

    try {

        const budgets = await Budget.find({
            user: req.user.id
        });

        const now = new Date();

        const month = now.getMonth();

        const year = now.getFullYear();

        const result = [];

        for (const budget of budgets) {

            const expenses = await Expense.find({

                user: req.user.id,

                category: budget.category,

                date: {

                    $gte: new Date(year, month, 1),

                    $lt: new Date(year, month + 1, 1)

                }

            });

            const spent = expenses.reduce(

                (sum, expense) => sum + expense.amount,

                0

            );

            const remaining = budget.amount - spent;

            const percentage = budget.amount > 0
                ? Math.round((spent / budget.amount) * 100)
                : 0;

            result.push({

                ...budget.toObject(),

                spent,

                remaining,

                percentage

            });

        }

        res.json(result);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

//UPDATE Budget
exports.updateBudget = async (req, res) => {

    try {

        const { category, month, year } = req.body;

        const duplicate = await Budget.findOne({

            _id: { $ne: req.params.id },

            user: req.user.id,

            category,

            month,

            year

        });

        if (duplicate) {

            return res.status(400).json({

                message: "Budget already exists."

            });

        }

        const budget = await Budget.findOneAndUpdate(

            {

                _id: req.params.id,

                user: req.user.id

            },

            req.body,

            {

                new: true

            }

        );

        res.json(budget);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

//DELETE Budget
exports.deleteBudget = async (req, res) => {

    try {

        await Budget.findOneAndDelete({

            _id: req.params.id,

            user: req.user.id

        });

        res.json({

            message: "Budget deleted."

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};