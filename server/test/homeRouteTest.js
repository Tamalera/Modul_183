const assert = require('assert');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');


describe('Unit testing the / route', () => {
  it('should return OK status', () => request(app)
    .get('/')
    .then((response) => {
      assert.equal(response.status, 200);
    }));

  it('should return an empty response body', () => request(app)
    .get('/')
    .then((response) => {
      expect(response.body).to.be.empty;
      expect(response.body).to.be.an('object');
    }));

  it('should show an html-page', () => request(app)
    .get('/')
    .then((response) => {
      expect(response.type).to.equal('text/html');
    }));
});
