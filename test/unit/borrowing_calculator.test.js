/**
 * Borrowing Power Calculator Test Suite
 */
const assert = require('assert'); 
const { BorrowingCalculator } = require('../../src/borrowing_calculator');

describe('BorrowingCalculator Unit Tests', () => {
  describe('calculateBorrowingPower', () => {
    const borrowingCalculator = new BorrowingCalculator(undefined, 4, 3.5);

    it('should calculate borrowing power for standard values', async () => {
      const result = borrowingCalculator.calculateBorrowingPower(125000, 25750, 3100, 3000, 10000);
      assert.ok(result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount');
      assert.strictEqual(result.monthlyRepayment, 4870.83);
    });

    it('should return 0 when maxMonthlyRepayment is less than or equal to 0 ', async () => {
      const result = borrowingCalculator.calculateBorrowingPower(30000, 2000, 1600, 4000, 5000);
      assert.strictEqual(result.maxLoanAmount, 0);
      assert.strictEqual(result.monthlyRepayment, 0);
    });

    it('should throw an error when the input parameters contain negative values', async () => {
      assert.throws(() => borrowingCalculator.calculateBorrowingPower(-30000, 2000, 1600, 4000, 5000));
    });

    it('should throw an error when the input parameters contain string values', async () => {
      assert.throws(() => borrowingCalculator.calculateBorrowingPower("30000", 2000, 1600, 4000, 5000));
    });

    it('should throw an error when the input parameters contain NaN values', async () => {
      assert.throws(() => borrowingCalculator.calculateBorrowingPower(NaN, 2000, 1600, 4000, 5000));
    });
  });
});
