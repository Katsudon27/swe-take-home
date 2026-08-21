const assert = require('assert');
const { APIClient } = require('../../APIClient');

describe('APIClient', () => {
    const client = new APIClient();
    const income = 125000

    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
    });

    describe ('getTax', () => {
        it('should return the tax value', async () => {
            global.fetch = async () => ({
                ok: true,
                json: async () => ({ income: income, tax: 25750 })
            });

            const tax = await client.getTax(income);
            assert.strictEqual(tax, 25750);
        });

        it('should throw error when response is not ok', async () => {
            global.fetch = async () => ({
                ok: false,
                status: 401,
                json: async () => ({ error: "Unauthorized", message: "Invalid PAT" })
            });

            await assert.rejects(client.getTax(income));
        });

        it('should throw error when the server is unavailable', async () => {
            global.fetch = async () => {
                throw new Error('fetch failed'); 
            };

            await assert.rejects(client.getTax(income));
        });

        it('should throw error if server returns invalid JSON', async () => {
            global.fetch = async () => ({
                ok: true,
                json: async () => ({ taxAmount: "1000" })
            });

            await assert.rejects(client.getTax(income));
        });

    });

    describe ('getHEM', () => {
        const dependents = 2

        it('should return the HEM value', async () => {
            global.fetch = async () => ({
                ok: true,
                json: async () => ({ income: income, dependents: dependents, hem: 3100 })
            });

            const hemValue = await client.getHEM(income, dependents);
            assert.strictEqual(hemValue, 3100);
        });

        it('should throw error if server returns invalid JSON', async () => {
            global.fetch = async () => ({
                ok: true,
                json: async () => ({ hemAmount: "1600" })
            });

            await assert.rejects(client.getHEM(income, dependents));
        });
    });
});
