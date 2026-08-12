const mongoose = require("mongoose");

const recurringExpenseHistorySchema = new mongoose.Schema({

    recurringExpense:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RecurringExpense"
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    title:String,

    amount:Number,

    category:String,

    paymentMethod:String,

    generatedDate:Date,

    status:{
        type:String,
        default:"Paid"
    }

},{
    timestamps:true
});

module.exports = mongoose.model(
    "RecurringExpenseHistory",
    recurringExpenseHistorySchema
);