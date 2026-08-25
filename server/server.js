/**
 * server.js
 * 
 * Local dev endpoint for Borrowing Calculator Code Challenge
 * 
 */
require('dotenv').config();

const http = require("http");
const { errorJSON } = require('./utils');
const { handleTax, handleHem } = require('./api_handler');

const PORT = 3000;
const validPAT = process.env.VALID_PAT

//Maps the API endpoints to their corresponding handlers
const api_routes = {
    "/api/tax": handleTax,
    "/api/hem": handleHem
};

//Authenticates the request by checking the Authorization header and the Bearer token
function authenticate(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        errorJSON(res, 401, "Missing Personal Access Token", "Provide the token using the Authorization: Bearer <token> header.");
        return false;
    }

    const token = authHeader.slice(7);
    if (token !== validPAT) {
        errorJSON(res, 401, "Invalid Personal Access Token", "The provided token is invalid.");
        return false;
    }

    return true;
}

const server = http.createServer((req, res) => {
    if (!authenticate(req, res)) return;

    if (req.method !== "GET") {
        return errorJSON(res, 405, "Method Not Allowed", "Only GET requests are supported.");
    }

    const url = new URL(req.url, `http://${/* istanbul ignore next */ req.headers.host || 'localhost'}`);
    const params = url.searchParams;

    console.log("==============================");
    console.log("Request:");
    console.table({ method: req.method, path: url.pathname });
    console.log("Headers:");
    console.table(req.headers);
    console.log("Params:");
    console.table(Object.fromEntries(params));
    console.log("==============================");

    const handler = api_routes[url.pathname]
    if (handler) {
        return handler(params, res);
    }

    return errorJSON(res, 404, "Not Found", "The requested endpoint does not exist.");
});

/* istanbul ignore next */
if (require.main === module) {
    //Start the server
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}

module.exports = server;
