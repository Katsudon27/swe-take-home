require('dotenv').config();
const request = require("supertest");
const assert = require('assert'); 

const server = require('../../server/server');

console.log = function() {} //Disable logging to allow test results to be viewed clearly

const taxEndpointURL = function (income) {
    return `/api/tax?income=${income}`;
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
});
