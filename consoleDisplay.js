const { BorrowingCalculator } = require('./BorrowingCalculator');
const { APIClient } = require('./APIClient');

function runConsoleMode() {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log("Mortgage Borrowing Power Calculator");
    console.log("===================================");

    rl.question("Gross Annual Income: $", (income) => {
        rl.question("Number of Dependents: ", (dependents) => {
            rl.question("Declared Monthly Expenses: $", (expenses) => {
                rl.question("Total Credit Card Limits: $", async (creditLimits) => {
                    const client = new APIClient();
                    const borrowingCalculator = new BorrowingCalculator(undefined, 7.0, 3.0);

                    const parsedIncome = parseFloat(income)
                    const parsedDependents = parseInt(dependents)

                    const annualTax = await client.getTax(parsedIncome)
                    const baselineHEM = await client.getHEM(parsedIncome, parsedDependents)


                    const result = await borrowingCalculator.calculateBorrowingPower(
                        parsedIncome,
                        annualTax,
                        baselineHEM,
                        parseFloat(expenses),
                        parseFloat(creditLimits)
                    );

                    console.log("\n--- Calculation Summary ---");
                    console.log(`Maximum Borrowing Power at ${borrowingCalculator.interestRate}%: $${result.maxLoanAmount.toLocaleString()}`);
                    console.log(`Assumed Monthly Mortgage Repayment: $${result.monthlyRepayment.toLocaleString()} over ${borrowingCalculator.loanTermYears} years`);
                    
                    rl.close();
                });
            });
        });
    });
}

if (require.main === module) {
    runConsoleMode();
}
