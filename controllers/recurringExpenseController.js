const RecurringExpense = require("../models/RecurringExpense");
const RecurringExpenseHistory = require("../models/RecurringExpenseHistory");

exports.createRecurringExpense = async (req, res) => {

    try {

        const recurringExpense =
            await RecurringExpense.create({

                user: req.user.id,

                ...req.body

            });

        res.status(201).json({

            success: true,

            recurringExpense

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getRecurringExpenses = async (req, res) => {

    try {

        const recurringExpenses = await RecurringExpense.find({
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            recurringExpenses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.updateRecurringExpense = async (req, res) => {

    try {

        const recurringExpense = await RecurringExpense.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true
            }
        );

        if (!recurringExpense) {
            return res.status(404).json({
                success: false,
                message: "Recurring expense not found"
            });
        }

        res.status(200).json({
            success: true,
            recurringExpense
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.deleteRecurringExpense = async (req, res) => {

    try {

        const recurringExpense = await RecurringExpense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!recurringExpense) {
            return res.status(404).json({
                success: false,
                message: "Recurring expense not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Recurring expense deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.toggleRecurringExpense = async (req,res)=>{

    const recurringExpense =
    await RecurringExpense.findOne({

        _id:req.params.id,

        user:req.user.id

    });

    if(!recurringExpense){

        return res.status(404).json({

            message:"Recurring Expense not found"

        });

    }

    recurringExpense.isActive =

    !recurringExpense.isActive;

    await recurringExpense.save();

    res.json(recurringExpense);

}

exports.getRecurringHistory = async (req, res) => {

    try {

        const history = await RecurringExpenseHistory.find({
            user: req.user.id
        }).sort({
            generatedDate: -1
        });

        res.json(history);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};