/**
 * Borrowing Power Calculator Test Suite
 */


const assert = require('assert'); 
const { BorrowingCalculator } = require('./borrowingCalculator');
const { apiClient } = require('./apiClient');

describe('BorrowingCalculator', () => {
  describe('calculateBorrowingPower', () => {

    it('should calculate borrowing power for standard values', async () => {
      const fakeClient = {
          getTax: async () => 25750,
          getHEM: async () => 3100
      };

      const borrowingCalculator = new BorrowingCalculator(fakeClient);

      const result = await borrowingCalculator.calculateBorrowingPower(125000, 2, 3000, 10000, 7.5);
      assert.ok(result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount');
      assert.strictEqual(result.monthlyRepayment, 4870.83);
    });

    it('should return 0 for invalid negative inputs', async () => {
      const fakeClient = {
        getTax: async () => 0,
        getHEM: async () => 0
      }

      const borrowingCalculator = new BorrowingCalculator(fakeClient);

      const result = await borrowingCalculator.calculateBorrowingPower(30000, 3, 4000, 5000, 7.5);
      assert.strictEqual(result.maxLoanAmount, 0);
      assert.strictEqual(result.monthlyRepayment, 0);
    });
  });
});

describe('apiClient', () => {
  const client = new apiClient();

  describe ('getTax', () => {
    it('should return the calculated annual income tax', async () => {
      const result = await client.getTax(125000);
      assert.strictEqual(result, 25750);
    });

    it('should return 0 for 0 income', async () => {
      const result = await client.getTax(0);
      assert.strictEqual(result, 0);
    });
  });

  describe('getHEM', () => {
    it('should return the calculated HEM monthly baseline cost', async () => {
      const result = await client.getHEM(125000, 2);
      assert.strictEqual(result, 3100);
    });

    it('should return 1600 for 0 income and 0 dependent', async () => {
      const result = await client.getHEM(0, 0);
      assert.strictEqual(result, 1600);
    });
  });

});
