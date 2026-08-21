/**
 * API Integration Test Suite
 */
const assert = require('assert'); 
const { APIClient } = require('../../src/api_client');

describe('APIClient', () => {
  const client = new APIClient();

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
