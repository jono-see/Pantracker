var sinon = require('sinon');
var expect = require('chai').expect;
var assert = require('chai').assert;
var should = require('chai').should();
var stores = require('../../models/stores.js');
var storeController = require('../../controller/storeController');
var chai = require('chai');
var chaiHttp = require('chai-http');

let server = require('../../app.js');


describe('testPostcode', function() {

    chai.use(chaiHttp);
    describe('getValidPostcode', function() {
        it("should return valid stores", (done) => {
            chai.request(server)
                .get('/stores/postcode/3000')
                .end((err, res) => {
                    res.should.have.status(200);
                    //res.body.should.be.a('object');
                    done();
                })
        })
        it("should return 1 valid store", (done) => {
            chai.request(server)
                .get('/stores/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    //res.body.should.be.a('object');
                    done();
                })
        })

        it("Postcode should return invalid since not in VIC", (done) => {
            chai.request(server)
                .get('/stores/search/4000')
                .end((err, res) => {
                    res.should.have.status(404);
                    //res.body.should.be.a('object');
                    done();
                })
        })
    });
});