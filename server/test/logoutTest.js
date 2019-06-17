const assert = require('assert');
const request = require('supertest');
const bodyParser = require('body-parser');
const app = require('../server');

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


describe('Unit testing the successful logout', () => {
  it('should logout logged in user', (done) => {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@test.com', password: 'password' })
      .then(() => request(app)
        .get('/logout')
        .then((res) => {
          assert.equal(res.status, 302);
          assert.equal(res.text, 'Found. Redirecting to /');
          assert.equal(res.redirect, true);
          assert.equal(res.header.location, '/');
        }));
    done();
  });
});
