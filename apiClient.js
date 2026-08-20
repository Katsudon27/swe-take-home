require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL
const VALID_PAT = process.env.VALID_PAT

class APIClient {
    async getTax(income) {
        const response = await fetch(`${SERVER_URL}/api/tax?income=${income}`, {
            headers: {
            'Authorization': `Bearer ${VALID_PAT}`
            }
        });

        if (!response.ok) {
            throw new Error(`Tax API failed with status ${response.status}`);
        }

        const responseJSON = await response.json();
        return responseJSON.tax;
    }

    async getHEM(income, dependents) {
        const response = await fetch(`${SERVER_URL}/api/hem?income=${income}&dependents=${dependents}`, {
            headers: {
            'Authorization': `Bearer ${VALID_PAT}`
            }
        });

        if (!response.ok) {
            throw new Error(`HEM API failed with status ${response.status}`);
        }

        const responseJSON = await response.json();
        return responseJSON.hem;
    }
}

module.exports = { APIClient };
