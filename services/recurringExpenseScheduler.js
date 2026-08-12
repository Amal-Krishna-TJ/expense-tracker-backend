const RecurringExpenseHistory = require("../models/RecurringExpenseHistory");
const RecurringExpense = require("../models/RecurringExpense");
const Expense = require("../models/Expense");

async function processRecurringExpenses() {

    console.log("processRecurringExpenses() called");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recurringExpenses = await RecurringExpense.find({
        isActive: true
    });

    console.log("Total recurring expenses:", recurringExpenses.length);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString();

    console.log(dateStr, timeStr);


    for (const recurring of recurringExpenses) {

        const dueDate = new Date(recurring.nextDueDate);
        dueDate.setHours(0, 0, 0, 0);

        // Skip only future expenses
        if (dueDate > today) {

            continue;

        }

        if (
            recurring.lastGeneratedDate &&
            new Date(recurring.lastGeneratedDate).getTime() === dueDate.getTime()
        ) {

            continue;

        }

        try {

            const expense = await Expense.create({

                user: recurring.user,

                amount: recurring.amount,

                category: recurring.category,

                paymentMethod: recurring.paymentMethod,

                description: recurring.title,

                notes: recurring.description,

                date: today

            });

            await RecurringExpenseHistory.create({

                recurringExpense: recurring._id,

                user: recurring.user,

                title: recurring.title,

                amount: recurring.amount,

                category: recurring.category,

                paymentMethod: recurring.paymentMethod,

                generatedDate: today,

                status: "Paid"

            });

            console.log(
                "History created"
            );

            recurring.lastGeneratedDate = today;

            updateNextDueDate(recurring);

            await recurring.save();

            console.log(
                "Recurring expense updated"
            );

        } catch (err) {

            console.error(
                "Scheduler Error:",
                err
            );

        }

    }

}

function updateNextDueDate(recurring) {

    const next = new Date(recurring.nextDueDate);

    switch (recurring.frequency) {

        case "Daily":
            next.setDate(next.getDate() + 1);
            break;

        case "Weekly":
            next.setDate(next.getDate() + 7);
            break;

        case "Monthly":
            next.setMonth(next.getMonth() + 1);
            break;

        case "Yearly":
            next.setFullYear(next.getFullYear() + 1);
            break;

    }

    recurring.nextDueDate = next;

}

module.exports = processRecurringExpenses;