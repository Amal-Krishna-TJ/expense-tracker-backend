const Expense = require("../models/Expense");
const Notification = require("../models/Notification");

// Add Expense
exports.addExpense = async (req, res) => {

    try {

        const expense = await Expense.create({

            user: req.user.id,

            amount: req.body.amount,

            category: req.body.category,

            date: req.body.date,

            paymentMethod: req.body.paymentMethod,

            description: req.body.description,

            notes: req.body.notes

        });

        res.status(201).json({

            success: true,

            expense

        });

        await Notification.create({

            user: req.user.id,

            title: "Expense Added",

            message:
                `₹${expense.amount} added under ${expense.category}`,

            type: "success"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Get all expenses of logged-in user
exports.getExpenses = async (req, res) => {

    try {

        const expenses = await Expense.find({
            user: req.user.id
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            expenses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Expense
exports.updateExpense = async (req, res) => {

    try {
        
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!expense) {

            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });

        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            {
                amount: req.body.amount,
                category: req.body.category,
                date: req.body.date,
                paymentMethod: req.body.paymentMethod,
                description: req.body.description,
                notes: req.body.notes
            },
            {
                new: true,
                runValidators: true
            }
        );

        await Notification.create({

            user: req.user.id,

            title: "Expense Added",

            message:
                `₹${expense.amount} added under ${expense.category}`,

            type: "success"

        });

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Expense
exports.deleteExpense = async (req, res) => {

    try {

        // Find expense and make sure it belongs
        // to the currently logged-in user
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!expense) {

            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });

        }

        await expense.deleteOne();

        await Notification.create({

            user: req.user.id,

            title: "Expense Added",

            message:
                `₹${expense.amount} added under ${expense.category}`,

            type: "success"

        });

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Expense Summary
exports.getExpenseSummary = async (req, res) => {

    try {

        // Get only logged-in user's expenses
        const expenses = await Expense.find({
            user: req.user.id
        });

        // No expenses
        if (expenses.length === 0) {

            return res.status(200).json({

                success: true,

                summary: {
                    totalExpense: 0,
                    transactions: 0,
                    highestCategory: "N/A",
                    largestExpense: 0,
                    averageExpense: 0,
                    currentMonth: 0
                }

            });

        }


        // -------------------------
        // TOTAL EXPENSE
        // -------------------------

        const totalExpense = expenses.reduce(
            (total, expense) =>
                total + expense.amount,
            0
        );


        // -------------------------
        // TRANSACTION COUNT
        // -------------------------

        const transactions = expenses.length;


        // -------------------------
        // LARGEST EXPENSE
        // -------------------------

        const largestExpense = Math.max(
            ...expenses.map(
                expense => expense.amount
            )
        );


        // -------------------------
        // AVERAGE EXPENSE
        // -------------------------

        const averageExpense =
            totalExpense / transactions;


        // -------------------------
        // HIGHEST CATEGORY
        // Based on total spending
        // -------------------------

        const categoryTotals = {};

        expenses.forEach(expense => {

            if (!categoryTotals[expense.category]) {

                categoryTotals[expense.category] = 0;

            }

            categoryTotals[expense.category] +=
                expense.amount;

        });


        const highestCategory =
            Object.keys(categoryTotals)
                .reduce((highest, category) => {

                    return categoryTotals[category] >
                           categoryTotals[highest]
                        ? category
                        : highest;

                });


        // -------------------------
        // CURRENT MONTH EXPENSE
        // -------------------------

        const now = new Date();

        const currentMonth =
            expenses
                .filter(expense => {

                    const expenseDate =
                        new Date(expense.date);

                    return (
                        expenseDate.getMonth() ===
                            now.getMonth() &&

                        expenseDate.getFullYear() ===
                            now.getFullYear()
                    );

                })
                .reduce(
                    (total, expense) =>
                        total + expense.amount,
                    0
                );


        // -------------------------
        // RESPONSE
        // -------------------------

        return res.status(200).json({

            success: true,

            summary: {

                totalExpense,

                transactions,

                highestCategory,

                largestExpense,

                averageExpense:
                    Math.round(averageExpense),

                currentMonth

            }

        });


    } catch (error) {

        console.error(
            "EXPENSE SUMMARY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Import multiple expenses from CSV
exports.importExpenses = async (req, res) => {

    try {

        const expenses = req.body.expenses;

        if (
            !expenses ||
            !Array.isArray(expenses) ||
            expenses.length === 0
        ) {

            return res.status(400).json({

                success: false,
                message: "No expenses provided"

            });

        }


        const formattedExpenses =
            expenses.map(expense => ({

                user: req.user.id,

                amount: Number(expense.amount),

                category: expense.category,

                date: expense.date,

                paymentMethod:
                    expense.paymentMethod,

                description:
                    expense.description || "",

                notes:
                    expense.notes || ""

            }));


        const importedExpenses = await Expense.insertMany(formattedExpenses);

        return res.status(201).json({

            success: true,

            message:
                `${importedExpenses.length} expenses imported successfully`,

            count:
                importedExpenses.length,

            expenses:
                importedExpenses

        });

        await Notification.create({

            user: req.user.id,

            title: "Expense Added",

            message:
                `₹${expense.amount} added under ${expense.category}`,

            type: "success"

        });

    } catch (error) {

        console.error(
            "IMPORT EXPENSE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};