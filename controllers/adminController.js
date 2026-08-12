const User = require("../models/User");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Category = require("../models/Category");
const RecurringExpense = require("../models/RecurringExpense");

exports.getDashboard = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const totalBudgets =
            await Budget.countDocuments();

        const totalCategories =
            await Category.countDocuments();

        const totalRecurring =
            await RecurringExpense.countDocuments({
                isActive: true
            });

        const expenses =
            await Expense.find();

        const totalExpenses =
            expenses.reduce(
                (sum, expense) =>
                    sum + expense.amount,
                0
            );

        const now = new Date();

        const monthlyExpense =
            expenses
                .filter(expense => {

                    const date =
                        new Date(expense.date);

                    return (

                        date.getMonth() ===
                        now.getMonth()

                        &&

                        date.getFullYear() ===
                        now.getFullYear()

                    );

                })
                .reduce(
                    (sum, expense) =>
                        sum + expense.amount,
                    0
                );

        res.json({

            success: true,

            dashboard: {

                totalUsers,

                totalExpenses,

                totalBudgets,

                totalCategories,

                totalRecurring,

                monthlyExpense

            }

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

exports.getUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");

        const result = [];

        for (const user of users) {

            const expenses = await Expense.find({
                user: user._id
            }).sort({ date: -1 });

            const totalExpense = expenses.reduce(
                (sum, expense) => sum + expense.amount,
                0
            );

            const transactions = expenses.length;

            const largestExpense =
                transactions > 0
                    ? Math.max(...expenses.map(e => e.amount))
                    : 0;

            const averageExpense =
                transactions > 0
                    ? Math.round(totalExpense / transactions)
                    : 0;

            let highestCategory = "N/A";

            if (transactions > 0) {

                const categoryTotals = {};

                expenses.forEach(expense => {

                    categoryTotals[expense.category] =
                        (categoryTotals[expense.category] || 0)
                        + expense.amount;

                });

                highestCategory = Object.keys(categoryTotals)
                    .reduce((a, b) =>
                        categoryTotals[a] > categoryTotals[b]
                            ? a
                            : b
                    );

            }

            const now = new Date();

            const currentMonth = expenses
                .filter(expense => {

                    const date = new Date(expense.date);

                    return (

                        date.getMonth() === now.getMonth()

                        &&

                        date.getFullYear() === now.getFullYear()

                    );

                })
                .reduce(
                    (sum, expense) => sum + expense.amount,
                    0
                );

            result.push({

                ...user.toObject(),

                summary: {

                    totalExpense,

                    transactions,

                    highestCategory,

                    largestExpense,

                    averageExpense,

                    currentMonth

                },

                recentExpenses: expenses.slice(0, 5)

            });

        }

        res.json({

            success: true,

            users: result

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
}

exports.deleteUser = async(req,res)=>{

    try{

        await User.findByIdAndDelete(

            req.params.id

        );

        res.json({

            success:true,

            message:"User deleted."

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

exports.getAnalytics = async (req, res) => {

    try {

        const expenses = await Expense.find();

        // Category Totals
        const categoryTotals = {};

        expenses.forEach(expense => {

            categoryTotals[expense.category] =
                (categoryTotals[expense.category] || 0)
                + expense.amount;

        });

        // Monthly Totals
        const monthlyTotals = {};

        expenses.forEach(expense => {

            const month =
                new Date(expense.date)
                .toLocaleString(
                    "default",
                    {
                        month: "short"
                    }
                );

            monthlyTotals[month] =
                (monthlyTotals[month] || 0)
                + expense.amount;

        });

        // User Registration
        const userRegistrations = {};

        const users = await User.find();

        users.forEach(user=>{

            const month =
                new Date(user.createdAt)
                .toLocaleString(
                    "default",
                    {
                        month:"short"
                    }
                );

            userRegistrations[month] =
                (userRegistrations[month]||0)+1;

        });

        res.json({

            success:true,

            analytics:{

                categoryTotals,

                monthlyTotals,

                userRegistrations

            }

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

