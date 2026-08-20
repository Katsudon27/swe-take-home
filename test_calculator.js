/**
 * Borrowing Power Calculator Test Suite
 */
const assert = require('assert'); 
const { BorrowingCalculator } = require('./BorrowingCalculator');

describe('BorrowingCalculator', () => {
  describe('calculateBorrowingPower', () => {

    it('should calculate borrowing power for standard values', async () => {

      const borrowingCalculator = new BorrowingCalculator(undefined, 4, 3.5);

      const result = borrowingCalculator.calculateBorrowingPower(125000, 25750, 3100, 3000, 10000, 7.5);
      assert.ok(result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount');
      assert.strictEqual(result.monthlyRepayment, 4870.83);
    });

    it('should return 0 for invalid negative inputs', async () => {

      const borrowingCalculator = new BorrowingCalculator(undefined, 4, 3.5);

      const result = borrowingCalculator.calculateBorrowingPower(30000, 3, 4000, 5000, 7.5);
      assert.strictEqual(result.maxLoanAmount, 0);
      assert.strictEqual(result.monthlyRepayment, 0);
    });
  });
});
