/**
 * Borrowing Power Calculator
 * 
 * Gen's incomplete prototype. 
 * This currently calculates what a user can borrow over 30 years.
 * Currently this code uses placeholder methods for Tax and HEM values. 
 */

/**
 * Calculates the total borrowing power amount and the monthly repayment configuration
 */

class BorrowingCalculator {
    constructor(loanTermYears = 30, interestRate, assessmentRateBuffer) {
        this.loanTermYears = loanTermYears
        this.loanTermMonths = loanTermYears * 12;
        
        this.interestRate = interestRate
        this.annualAssessmentRate = interestRate + assessmentRateBuffer
    }

    calculateBorrowingPower(input) {
        //Ensure that the parameters passed in are non-negative numbers
        for (const key in input) {
            if (typeof input[key] !== 'number' || Number.isNaN(input[key]) || input[key] < 0) {
                throw new Error(`Invalid value for ${key}: must be a non-negative number.`); 
            }
        }

        // 1. Calculate Net Monthly Income after tax deductions
        const netMonthlyIncome = (input.income - input.annualTax) / 12;

        // 2. Determine living expenses (User declared expenses vs HEM baseline, whichever is higher)
        const totalLivingExpenses = Math.max(input.expenses, input.baselineHEM);

        // 3. Calculate credit card liability (~3% of total limits)
        const creditCardLiability = input.creditLimits * 0.03;

        // 4. Calculate monthly repayment capacity
        const maxMonthlyRepayment = netMonthlyIncome - totalLivingExpenses - creditCardLiability;

        // Return early if user cannot afford a loan at all
        if (maxMonthlyRepayment <= 0) {
            return { maxLoanAmount: 0, monthlyRepayment: 0 };
        }

        // 5. Calculate the monthly interest rate
        const monthlyRate = (this.annualAssessmentRate / 100) / 12;

        // 6. Calculate maximum borrowing power using the following formula:
        // P = M * (1 - (1 + R)^-N) / R
        const maxLoanAmount = maxMonthlyRepayment * ((1 - Math.pow(1 + monthlyRate, - this.loanTermMonths)) / monthlyRate);

        return {
            maxLoanAmount: Number(maxLoanAmount.toFixed(2)),
            monthlyRepayment: Number(maxMonthlyRepayment.toFixed(2))
        };
    }
}

module.exports = { BorrowingCalculator };
