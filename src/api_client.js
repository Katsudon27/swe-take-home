class APIClient {
    constructor(serverURL, validPAT) {
        this.serverURL = serverURL
        this.validPAT = validPAT
    }

    async #request(path, errorMessage) {
        try {
            const response = await fetch(`${this.serverURL}${path}`, {
                headers: {
                    Authorization: `Bearer ${this.validPAT}`
                }
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`${errorMessage} ${response.status} - ${errorDetails.error} (${errorDetails.message})`);
            }

            return response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

    async getTax(income) {
        const data = await this.#request(
            `/api/tax?income=${income}`,
            'Tax API failed with status code'
        );

        if (data.tax == undefined) {
            throw new Error(`Invalid JSON returned by server.`); 
        }else {
            return data.tax;
        }
    }

    async getHEM(income, dependents) {
        const data = await this.#request(
            `/api/hem?income=${income}&dependents=${dependents}`,
            'HEM API failed with status code'
        );

        if (data.hem == undefined) {
            throw new Error(`Invalid JSON returned by server.`); 
        }else {
            return data.hem;
        }
    }
}

module.exports = { APIClient };
