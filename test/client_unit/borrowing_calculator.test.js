/**
 * Borrowing Power Calculator Test Suite
 */
const assert = require('assert'); 
const { BorrowingCalculator } = require('../../src/borrowing_calculator');

describe('BorrowingCalculator Unit Tests', () => {
  describe('calculateBorrowingPower', () => {
    const borrowingCalculator = new BorrowingCalculator(undefined, 4, 3.5);

    let standardInput = {
      income: 125000,
      annualTax: 25750,
      baselineHEM: 3100,
      expenses: 3000,
      creditLimits: 10000
    };

    it('should calculate borrowing power for standard values', async () => {
      const result = borrowingCalculator.calculateBorrowingPower(standardInput);
      assert.ok(result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount');
      assert.strictEqual(result.monthlyRepayment, 4870.83);
    });

    it('should return 0 when maxMonthlyRepayment is less than or equal to 0 ', async () => {
      const input = {
        income: 30000,
        annualTax: 2000,
        baselineHEM: 1600,
        expenses: 4000,
        creditLimits: 5000
      };

      const result = borrowingCalculator.calculateBorrowingPower(input);
      assert.strictEqual(result.maxLoanAmount, 0);
      assert.strictEqual(result.monthlyRepayment, 0);
    });

    it('should throw an error when the input parameters contain negative values', async () => {
      standardInput.income = -30000
      assert.throws(() => borrowingCalculator.calculateBorrowingPower(standardInput));
    });

    it('should throw an error when the input parameters contain string values', async () => {
      standardInput.income = "30000"
      assert.throws(() => borrowingCalculator.calculateBorrowingPower(standardInput));
    });

    it('should throw an error when the input parameters contain NaN values', async () => {
      standardInput.income = NaN
      assert.throws(() => borrowingCalculator.calculateBorrowingPower(standardInput));
    });
  });
});
