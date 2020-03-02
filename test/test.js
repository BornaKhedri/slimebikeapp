// import  { expect } from 'chai';

// describe("Index Test", () => {
//     it('should always pass', function() {
//         expect(true).to.equal(true);
//     });
// });

const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const request = require('supertest');

const {
    expect
} = chai;

chai.use(chaiHttp);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("Server!", () => {
    it("welcomes user to the api", async function () {
        const res = await request(app).get('https://128.95.204.113:3000');
        expect(res.status).to.equal(200);
    }).timeout(10000);
});
