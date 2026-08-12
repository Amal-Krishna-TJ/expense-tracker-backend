const mongoose = require("mongoose");

const recurringExpenseSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        default: "UPI"
    },

    frequency: {
        type: String,
        enum: [
            "Daily",
            "Weekly",
            "Monthly",
            "Yearly"
        ],
        default: "Monthly"
    },

    nextDueDate: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastGeneratedDate: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "RecurringExpense",
    recurringExpenseSchema
);