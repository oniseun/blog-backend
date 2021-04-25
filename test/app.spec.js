/* eslint-disable no-undef */


const request = require('supertest')
const app = require('../src/app')
const { expect } =  require('chai')
const enums = require('../src/config/enums')
const { StatusCodes } = require('http-status-codes')
const TIMEOUT = 30000
describe('GET /health', function() {
    it('responds with 200 status and json', function(done) {
      request(app)
        .get('/health')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)
        .end(function(err, res) {
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('version')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('env')
          expect(res.body).to.have.property('stats')
          expect(res.body).to.have.property('keys')
          return done();
        })
    });
  }).timeout(TIMEOUT)

  describe('GET /api/ping', function() {
    it('responds with 200 status and true', function(done) {
      request(app)
        .get('/api/ping')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)
        .end(function(err, res) {
          expect(res.body).to.have.property('success')
          expect(res.body.success).to.be.true
          return done();
        })
    });
  }).timeout(TIMEOUT)


describe('GET /api/posts?tag=politics', function() {
  it('fails with 400 BAD_REQUEST , Tags parameter is required', function(done) {
    request(app)
      .get('/api/posts?tag=politics')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
      .end(function(err, res ) {
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.be.equal(enums.TAG_REQUIRED)
        if (err) return done(err);
        return done();
      })
  }).timeout(TIMEOUT)
})

describe('GET /api/posts?tags=politics&sortBy=fakeSort', function() {
    it('fails with 400 BAD_REQUEST , sortBy parameter is invalid', function(done) {
      request(app)
        .get('/api/posts?tags=politics&sortBy=fakeSOrt')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)
        .end(function(err, res ) {
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.be.equal(enums.INVALID_SORTBY)
          if (err) return done(err);
          return done();
        })
    }).timeout(TIMEOUT)
  })
describe('GET /api/posts?tags=tech&direction=left', function() {
  it('fails with 400 BAD_REQUEST , direction parameter is invalid', function(done) {
    request(app)
      .get('/api/posts?tags=tech&direction=ids')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
      .end(function(err, res ) {
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.be.equal(enums.INVALID_DIRECTION)
        if (err) return done(err);
        return done();
      })
  }).timeout(TIMEOUT)

})