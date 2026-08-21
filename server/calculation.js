const HEM_MATRIX = {
    low:    { 0: 1600, 1: 2100, 2: 2500, 3: 2800 },
    medium: { 0: 2200, 1: 2700, 2: 3100, 3: 3500 },
    high:   { 0: 2600, 1: 3100, 2: 3600, 3: 4100 }
};


/**
 * Mock HEM Calculation
*/
function calcHem(income, dependents) {
    const incomeTier = income > 150000 ? 'high' : income > 60000 ? 'medium' : 'low';
    const depCount = Math.min(Math.max(Math.floor(dependents), 0), 3);
    return HEM_MATRIX[incomeTier][depCount];
}

/**
 * Mock Tax Calculation
*/
function calcTax(income) {
    let tax = 0;

    if (income > 100000) {
        tax += (income - 100000) * 0.35;
        income = 100000;
    }

    if (income > 50000) {
        tax += (income - 50000) * 0.25;
        income = 50000;
    }

    if (income > 20000) {
        tax += (income - 20000) * 0.15;
    }

    return Math.round(tax);
}

module.exports = { calcHem, calcTax };
