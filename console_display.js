require('dotenv').config();

const { BorrowingCalculator } = require('./src/borrowing_calculator');
const { APIClient } = require('./src/api_client');


function askQuestion(interface, query) {
  return new Promise(resolve => {
    interface.question(query, resolve);
  });
}

async function runConsoleMode() {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log("Mortgage Borrowing Power Calculator");
    console.log("===================================");

    //Prompt user to input data
    const income = await askQuestion(rl, "Gross Annual Income: $");
    const dependents = await askQuestion(rl, "Number of Dependents: ");
    const expenses = await askQuestion(rl, "Declared Monthly Expenses: $");
    const creditLimits = await askQuestion(rl, "Total Credit Card Limits: $");

    //Instantiate objects required for calculation of borrowing power
    const client = new APIClient(process.env.SERVER_URL, process.env.VALID_PAT);
    const borrowingCalculator = new BorrowingCalculator(undefined, 7.0, 3.0);

    //Parse income and dependents for subsequent API callings
    const parsedIncome = parseFloat(income)
    const parsedDependents = parseInt(dependents)

    //Make API calls to retrieve tax amount and HEM
    const annualTax = await client.getTax(parsedIncome)
    const baselineHEM = await client.getHEM(parsedIncome, parsedDependents)

    const result = borrowingCalculator.calculateBorrowingPower({
      income: parsedIncome,
      annualTax: annualTax,
      baselineHEM: baselineHEM,
      expenses: parseFloat(expenses),
      creditLimits: parseFloat(creditLimits)
    });

    console.log("\n--- Calculation Summary ---");
    console.log(`Maximum Borrowing Power at ${borrowingCalculator.interestRate}%: $${result.maxLoanAmount.toLocaleString()}`);
    console.log(`Assumed Monthly Mortgage Repayment: $${result.monthlyRepayment.toLocaleString()} over ${borrowingCalculator.loanTermYears} years`);
    
    rl.close();
}

if (require.main === module) {
    runConsoleMode();
}
