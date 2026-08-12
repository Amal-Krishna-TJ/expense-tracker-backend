const Category = require("../models/Category");


// GET USER CATEGORIES
exports.getCategories = async (req, res) => {

    try {

        const categories = await Category.find({
            user: req.user.id
        }).sort({ name: 1 });

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ADD CATEGORY
exports.addCategory = async (req, res) => {

    try {

        const name = req.body.name?.trim();

        if (!name) {

            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });

        }


        const existingCategory = await Category.findOne({
            user: req.user.id,
            name: {
                $regex: `^${name}$`,
                $options: "i"
            }
        });


        if (existingCategory) {

            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });

        }


        const category = await Category.create({

            user: req.user.id,

            name

        });


        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};