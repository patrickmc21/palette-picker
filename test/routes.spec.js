const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request('http://localhost:3000')
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(error => console.log(err))
  });
});

describe('API Routes', () => {
  describe('GET /api/v1/projects', () => {
    it('should return all the projects', () => {
      return chai.request('http://localhost:3000')
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');

      })
    })
  })
});