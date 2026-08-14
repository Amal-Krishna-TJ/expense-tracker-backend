const nodemailer = require("nodemailer");

exports.sendContactMail = async (req, res) => {

    try {

        const {
            username,
            email,
            subject,
            message
        } = req.body;

        // Create mail transporter
        const transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }

        });

        // Send email
        await transporter.sendMail({

            from: `"Expense Tracker Contact" <${process.env.MAIL_USER}>`,

            to: process.env.MAIL_USER,

            replyTo: email,

            subject: subject,

            html: `
                <h2>New Contact Message</h2>

                <p>
                    <strong>Name:</strong> ${username}
                </p>

                <p>
                    <strong>Email:</strong> ${email}
                </p>

                <p>
                    <strong>Subject:</strong> ${subject}
                </p>

                <hr>

                <p>
                    <strong>Message:</strong>
                </p>

                <p>
                    ${message}
                </p>
            `

        });

        res.status(200).json({

            success: true,

            message: "Message sent successfully"

        });

    }

    catch (error) {

        console.error("MAIL ERROR:", error);

        res.status(500).json({

            success: false,

            message: "Failed to send message"

        });

    }

};