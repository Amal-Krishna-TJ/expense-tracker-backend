const Notification =
    require("../models/Notification");

exports.getNotifications =
async (req, res) => {

    try {

        const notifications =
            await Notification.find({

                user: req.user.id

            })
            .sort({ createdAt: -1 });

        res.json({

            success: true,

            notifications

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};