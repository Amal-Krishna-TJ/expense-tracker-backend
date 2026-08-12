const Expense = require("../models/Expense");

exports.getDashboard = async (req, res) => {

    try {

        const expenses = await Expense.find({
            user: req.user.id
        }).sort({ date: -1 });

        const today = new Date();

        // -------------------
        // Total Expense
        // -------------------

        const totalExpense = expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );

        // -------------------
        // Today's Expense
        // -------------------

        const todayExpense = expenses
            .filter(expense => {

                const date = new Date(expense.date);

                return (
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                );

            })
            .reduce(
                (sum, expense) =>
                    sum + Number(expense.amount),
                0
            );

        // -------------------
        // Current Month Expense
        // -------------------

        const thisMonthExpense = expenses
            .filter(expense => {

                const date = new Date(expense.date);

                return (
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                );

            })
            .reduce(
                (sum, expense) =>
                    sum + Number(expense.amount),
                0
            );

        // -------------------
        // Recent Transactions
        // -------------------

        const recentTransactions =
            expenses.slice(0, 5);

        // -------------------
        // Category Totals
        // -------------------

        const categoryTotals = {};

        expenses.forEach(expense => {

            if (!categoryTotals[expense.category]) {

                categoryTotals[expense.category] = 0;

            }

            categoryTotals[expense.category] +=
                Number(expense.amount);

        });

        const topCategory =
            Object.keys(categoryTotals).length

                ? Object.keys(categoryTotals).reduce(

                    (a, b) =>

                        categoryTotals[a] >
                        categoryTotals[b]

                            ? a

                            : b

                )

                : "N/A";

        // -------------------
        // Weekly Chart
        // -------------------

        const weeklyChart =
            [0, 0, 0, 0, 0, 0, 0];

        expenses.forEach(expense => {

            const date =
                new Date(expense.date);

            const diff =

                Math.floor(

                    (today - date)

                    /

                    (1000 * 60 * 60 * 24)

                );

            if (diff >= 0 && diff < 7) {

                const index =
                    6 - diff;

                weeklyChart[index] +=
                    Number(expense.amount);

            }

        });

        return res.json({

            success: true,

            summary: {

                totalExpense,

                todayExpense,

                thisMonthExpense,

                transactionCount:
                    expenses.length,

                largestExpense:

                    expenses.length

                        ? Math.max(

                            ...expenses.map(

                                expense =>

                                    Number(expense.amount)

                            )

                        )

                        : 0,

                topCategory,

                recentTransactions,

                weeklyChart

            }

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};