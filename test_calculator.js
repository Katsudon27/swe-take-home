/**
 * Borrowing Power Calculator Test Suite
 */


const assert = require('assert'); 
const {calculateBorrowingPower, getTax} = require('./borrowingCalculator');

describe('Term Deposit Calculator Tests', () => {

  it('should calculate borrowing power for standard values', () => {
    const result = calculateBorrowingPower(120000, 2, 3000, 10000, 7.5);
    assert.ok(result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount');
    assert.strictEqual(result.monthlyRepayment, 4200);
  });

  it('should return 0 for invalid negative inputs', () => {
    const result = calculateBorrowingPower(30000, 3, 4000, 5000, 7.5);
    assert.strictEqual(result.maxLoanAmount, 0);
    assert.strictEqual(result.monthlyRepayment, 0);
  });
});

describe('getTax Tests', () => {

  it('should return the calculated annual income tax', async () => {
    const result = await getTax(125000);
    assert.strictEqual(result, 25750);
  });

  it('should return 0 for 0 income', async () => {
    const result = await getTax(0);
    assert.strictEqual(result, 0);
  });
});
