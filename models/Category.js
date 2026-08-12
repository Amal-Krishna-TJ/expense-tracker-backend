const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent same user from creating duplicate category
categorySchema.index(
    { user: 1, name: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "Category",
    categorySchema
);