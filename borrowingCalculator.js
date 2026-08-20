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
    constructor(client, loan_term_years = 30) {
        this.client = client
        this.loan_term_months = loan_term_years * 12
    }

    async calculateBorrowingPower(income, dependents, expenses, creditLimits, annualAssessmentRate) {
        // 1. Calculate Net Monthly Income after tax deductions
        const annualTax = await this.client.getTax(income);
        const netMonthlyIncome = (income - annualTax) / 12;

        // 2. Determine living expenses (User declared expenses vs HEM baseline, whichever is higher)
        const baselineHEM = await this.client.getHEM(income, dependents);
        const totalLivingExpenses = Math.max(expenses, baselineHEM);

        // 3. Calculate credit card liability (~3% of total limits)
        const creditCardLiability = creditLimits * 0.03;

        // 4. Calculate monthly repayment capacity
        const maxMonthlyRepayment = netMonthlyIncome - totalLivingExpenses - creditCardLiability;

        // Return early if user cannot afford a loan at all
        if (maxMonthlyRepayment <= 0) {
            return { maxLoanAmount: 0, monthlyRepayment: 0 };
        }

        // 5. Calculate the monthly interest rate
        const monthlyRate = (annualAssessmentRate / 100) / 12;

        // 6. Calculate maximum borrowing power using the following formula:
        // P = M * (1 - (1 + R)^-N) / R
        const maxLoanAmount = maxMonthlyRepayment * ((1 - Math.pow(1 + monthlyRate, - this.loan_term_months)) / monthlyRate);

        return {
            maxLoanAmount: Number(maxLoanAmount.toFixed(2)),
            monthlyRepayment: Number(maxMonthlyRepayment.toFixed(2))
        };
    }
}

module.exports = { BorrowingCalculator };
