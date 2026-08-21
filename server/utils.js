function sendJSON(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(body));
}

function errorJSON(res, statusCode, error, message) {
    return sendJSON(res, statusCode, { error, message });
}

function paramNumberCheck(params, key, label) {
    const rawValue = params.get(key);
    if (rawValue === null || rawValue.trim() === "") {
        return { error: `${label} is required`, message: `Provide ${key} parameter.` };
    }

    const value = Number(rawValue);
    if (!Number.isFinite(value) || value < 0) {
        return { error: `Invalid ${label.toLowerCase()}`, message: `${label} must be a non-negative number.` };
    }

    return { value: Math.round(value) };
}

module.exports = { sendJSON, errorJSON, paramNumberCheck };
