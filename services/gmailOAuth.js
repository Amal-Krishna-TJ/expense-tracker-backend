const { google } = require("googleapis");

const REDIRECT_URI =
    "https://expense-tracker-backend-yur9.onrender.com/api/auth/google/callback";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
);

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
];

const getAuthUrl = () => {

    return oauth2Client.generateAuthUrl({

        access_type: "offline",

        scope: SCOPES,

        prompt: "consent",

        include_granted_scopes: true

    });

};

const getTokens = async (code) => {

    const { tokens } =
        await oauth2Client.getToken(code);

    return tokens;

};

module.exports = {
    oauth2Client,
    getAuthUrl,
    getTokens
};