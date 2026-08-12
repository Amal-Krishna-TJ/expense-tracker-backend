require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

const cron = require("node-cron");

const processRecurringExpenses = require("./services/recurringExpenseScheduler");

connectDB();

app.use(cors({
    origin: 'https://expense-tracker-frontend-fawn-one.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express.json());
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Expense Tracker API is running"
    });

});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/recurring-expenses", require("./routes/recurringExpenseRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

cron.schedule(

    "0 0 0 * * *",

    async()=>{

        console.log(
            "Checking recurring expenses..."
        );

        await processRecurringExpenses();

    }

);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});