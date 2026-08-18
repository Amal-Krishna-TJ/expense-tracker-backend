const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://expense-tracker-backend-yur9.onrender.com/api/auth/google/callback"
);

const sendGmail = async ({
    to,
    subject,
    html
}) => {

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client
    });

    const message = [
        `From: Expense Tracker <${process.env.EMAIL_USER}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "",
        html
    ].join("\r\n");

    const encodedMessage = Buffer
        .from(message)
        .toString("base64url");

    const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage
        }
    });

    return response.data;
};

module.exports = sendGmail;