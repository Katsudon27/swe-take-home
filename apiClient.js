require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL
const VALID_PAT = process.env.VALID_PAT

class APIClient {
    async #request(path, errorMessage) {
        const response = await fetch(`${SERVER_URL}${path}`, {
            headers: {
                Authorization: `Bearer ${VALID_PAT}`
            }
        });

        if (!response.ok) {
            throw new Error(`${errorMessage}: ${response.status}`);
        }

        return response.json();
    }

    async getTax(income) {
        const data = await this.#request(
            `/api/tax?income=${income}`,
            'Tax API failed with status code'
        );

        return data.tax;
    }

    async getHEM(income, dependents) {
        const data = await this.#request(
            `/api/hem?income=${income}&dependents=${dependents}`,
            'HEM API failed with status code'
        );

        return data.hem;
    }
}

module.exports = { APIClient };
