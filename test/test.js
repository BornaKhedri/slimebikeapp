// import  { expect } from 'chai';

// describe("Index Test", () => {
//     it('should always pass', function() {
//         expect(true).to.equal(true);
//     });
// });

// const app = require("../app");
// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const request = require('supertest');

// const {
//     expect
// } = chai;

// chai.use(chaiHttp);

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// console.log(process.env.PORT);

// describe("Server!", () => {
//     it("welcomes user to the api", async function () {
//         const res = await request(app).get('http://localhost:' + process.env.PORT);
//         expect(res.status).to.equal(200);
//     }).timeout(10000);
// });


var expect = require('chai').expect;
var request = require('request');

it('Main page content', function(done) {
    request('http://localhost:' + process.env.PORT, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});