require('dotenv').config();
const VALID_PAT = process.env.VALID_PAT

async function getTax(income) {
    const response = await fetch(`http://localhost:3000/api/tax?income=${income}`, {
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

async function getHEM(income, dependents) {
    const response = await fetch(`http://localhost:3000/api/hem?income=${income}&dependents=${dependents}`, {
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

module.exports = { getTax, getHEM };
