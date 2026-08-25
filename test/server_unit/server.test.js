require('dotenv').config();
const request = require("supertest");
const assert = require('assert'); 

const server = require('../../server/server');

console.log = function() {} //Disable logging to allow test results to be viewed clearly

const taxEndpointURL = function (income) {
    return `/api/tax?income=${income}`;
};

const hemEndpointURL = function (income, dependents) {
    return `/api/hem?income=${income}&dependents=${dependents}`;
};

const validPAT = process.env.VALID_PAT

describe('Server Unit Tests', () => {
    describe ('Tax API Endpoint', () => {
        it('should return the calculated annual income tax', (done) => {
            request(server)
                .get(taxEndpointURL(125000))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(200) 
                .expect(function (res) {
                    assert.strictEqual(res.body.tax, 25750);
                })
                .end(done);
        });

        it('should return 0 for 0 income', (done) => {
            request(server)
                .get(taxEndpointURL(0))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(200) 
                .expect(function (res) {
                    assert.strictEqual(res.body.tax, 0);
                })
                .end(done);
        });

        it('should return correct error response for invalid Authorization header token', (done) => {
            request(server)
                .get(taxEndpointURL(125000))
                .set('Authorization', 'Bearer invalid_pat')
                .expect(401)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Invalid Personal Access Token");
                })
                .end(done);
        });

        it('should return the correct error response for missing Authorization header token', (done) => {
            request(server)
                .get(taxEndpointURL(125000))
                .expect(401)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Missing Personal Access Token");
                })
                .end(done);
        });

        it('should return the correct error response for negative query parameter', (done) => {
            request(server)
                .get(taxEndpointURL(-1000))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(400)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Invalid income");
                })
                .end(done);
        });

        it('should return the correct error response for non-numeric query parameter', (done) => {
            request(server)
                .get(taxEndpointURL("abcd"))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(400)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Invalid income");
                })
                .end(done);
        });

        it('should return the correct error response for missing query parameter', (done) => {
            request(server)
                .get('/api/tax')
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(400)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Income is required");
                })
                .end(done);
        });

        it('should return the correct error response for wrong endpoint path', (done) => {
            request(server)
                .get('/api/annualTax?income=1000')
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(404)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Not Found");
                })
                .end(done);
        });

        it('should return the correct error response for non-GET requests', (done) => {
            request(server)
                .post(taxEndpointURL(125000))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(405)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Method Not Allowed");
                })
                .end(done);
        });
    });

    describe ('HEM API Endpoint', () => {
        it('should return 3600 for 2 dependents in high income tier', (done) => {
            request(server)
                .get(hemEndpointURL(160000, 2))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(200) 
                .expect(function (res) {
                    assert.strictEqual(res.body.hem, 3600);
                })
                .end(done);
        });

        it('should return 2700 for 1 dependent in medium income tier', (done) => {
            request(server)
                .get(hemEndpointURL(70000, 1))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(200) 
                .expect(function (res) {
                    assert.strictEqual(res.body.hem, 2700);
                })
                .end(done);
        });

        it('should return 1600 for 0 dependents low income tier', (done) => {
            request(server)
                .get(hemEndpointURL(0, 0))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(200) 
                .expect(function (res) {
                    assert.strictEqual(res.body.hem, 1600);
                })
                .end(done);
        });

        it('should cap the dependents at 3 and return the correct HEM amount', (done) => {
            request(server)
                .get(hemEndpointURL(0, 5))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(200) 
                .expect(function (res) {
                    assert.strictEqual(res.body.hem, 2800);
                })
                .end(done);
        });

        it('should return the correct error response for negative income', (done) => {
            request(server)
                .get(hemEndpointURL(-1000, 2))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(400)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Invalid income");
                })
                .end(done);
        });

        it('should return the correct error response for negative dependents', (done) => {
            request(server)
                .get(hemEndpointURL(1000, -2))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(400)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Invalid dependents");
                })
                .end(done);
        });

        it('should return the correct error response for missing income', (done) => {
            request(server)
                .get('/api/hem?dependents=2')
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(400)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Income is required");
                })
                .end(done);
        });

        it('should return the correct error response for non-numeric query parameter', (done) => {
            request(server)
                .get(hemEndpointURL("abcd", 2))
                .set('Authorization', `Bearer ${validPAT}`)
                .expect(400)
                .expect(function (res) {
                    assert.strictEqual(res.body.error, "Invalid income");
                })
                .end(done);
        });
    });
});
