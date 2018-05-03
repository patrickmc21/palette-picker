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
    .catch(error => console.log(error))
  });

  it('should return 404 for a route that does not exist', () => {
    return chai.request('http://localhost:3000')
    .get('/sad')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(error => console.log(error))
  })
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
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('id');
      })
      .catch(error => console.log(error))
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return the palettes for given project', () => {
      return chai.request('http://localhost:3000')
      .get('/api/v1/projects/2/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('color1');
        response.body[0].should.have.property('color2');
        response.body[0].should.have.property('color3');
        response.body[0].should.have.property('color4');
        response.body[0].should.have.property('color5');
        response.body[0].should.have.property('project_id');
      })
      .catch(error => console.log(error));
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should post a project to the database', () => {
      return chai.request('http://localhost:3000')
      .post('/api/v1/projects')
      .send({
        name: 'Warm'
      })
      .then(response => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
      })
      .catch(error => console.log(error));
    });

    it('should not create a project with missing name', () => {
      return chai.request('http://localhost:3000')
      .post('/api/v1/projects')
      .send({})
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal('Please include a project name')
      })
      .catch(error => console.log(error))
    });
  });

  describe('POST /api/v1/projects/:project_id/palette', () => {
    it('should post a palette to a project', () => {
      
    });
  });
});