const sendGmail = require("../services/gmailService");


exports.sendContactMail = async (req, res) => {

    try {

        const {
            username,
            email,
            subject,
            message
        } = req.body;


        // ========================================
        // EMAIL 1
        // Send contact message to admin
        // ========================================

        await sendGmail({

            to: process.env.EMAIL_USER,

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


        // ========================================
        // EMAIL 2
        // Send confirmation to user
        // ========================================

        await sendGmail({

            to: email,

            subject: "We received your message",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                ">

                    <h2 style="color: #003049;">
                        Hello ${username},
                    </h2>

                    <p>
                        Thank you for contacting
                        <strong>Expense Tracker</strong>.
                    </p>

                    <p>
                        We have received your message successfully.
                    </p>

                    <div style="
                        background: #f5f5f5;
                        padding: 15px;
                        border-radius: 10px;
                        margin: 20px 0;
                    ">

                        <p>
                            <strong>Subject:</strong>
                            ${subject}
                        </p>

                        <p>
                            <strong>Your Message:</strong>
                        </p>

                        <p>
                            ${message}
                        </p>

                    </div>

                    <p>
                        Our team will review your message and
                        get back to you as soon as possible.
                    </p>

                    <p>
                        Thank you for using
                        <strong>Expense Tracker</strong>.
                    </p>

                    <hr>

                    <p style="
                        font-size: 13px;
                        color: #777;
                    ">
                        This is an automated response.
                        Please do not reply to this email.
                    </p>

                </div>
            `

        });


        // ========================================
        // SUCCESS
        // ========================================

        res.status(200).json({

            success: true,

            message: "Message sent successfully"

        });


    }

    catch (error) {

        console.error(
            "GMAIL API ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to send message"

        });

    }

};