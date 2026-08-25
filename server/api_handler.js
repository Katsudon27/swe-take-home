const { calcTax, calcHem } = require('./calculation')
const { sendJSON, errorJSON, paramNumberCheck } = require('./utils')

//handles incoming request to the tax API 
function handleTax(params, res) {
    const incomeResult = paramNumberCheck(params, "income", "Income");
    if (incomeResult.error) {
        return errorJSON(res, 400, incomeResult.error, incomeResult.message);
    }

    return sendJSON(res, 200, {
        income: incomeResult.value,
        tax: calcTax(incomeResult.value)
    });
}

//handles incoming request to the HEM API
function handleHem(params, res) {
    const incomeResult = paramNumberCheck(params, "income", "Income");
    if (incomeResult.error) {
        return errorJSON(res, 400, incomeResult.error, incomeResult.message);
    }

    const dependentsResult = paramNumberCheck(params, "dependents", "Dependents");
    if (dependentsResult.error) {
        return errorJSON(res, 400, dependentsResult.error, dependentsResult.message);
    }

    return sendJSON(res, 200, {
        income: incomeResult.value,
        dependents: dependentsResult.value,
        hem: calcHem(incomeResult.value, dependentsResult.value)
    });
}

module.exports = { handleHem, handleTax };
