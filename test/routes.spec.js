const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const { app, db } = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', (done) => {
    chai.request(app)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    })
  });

  it('should return 404 for a route that does not exist', (done) => {
    chai.request(app)
    .get('/sad')
    .end((error, response) => {
      response.should.have.status(404);
      done();
    })
  })
});

describe('API Routes', () => {

  beforeEach(() => {
    return db.migrate.rollback()
    .then(function() {
      return db.migrate.latest();
    })
    .then(function() {
      return db.seed.run();
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return all the projects', (done) => {
      chai.request(app)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('id');
        done();
      })
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return the palettes for given project', (done) => {
      chai.request(app)
      .get('/api/v1/projects/1/palettes')
      .end((error, response) => {
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
        done();
      })
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should post a project to the database', (done) => {
      chai.request(app)
      .post('/api/v1/projects')
      .send({
        name: 'Warm'
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        done();
      })
    });

    it('should not create a project with missing name', (done) => {
      chai.request(app)
      .post('/api/v1/projects')
      .send({})
      .end((error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('Please include a project name');
        done();
      })
    });
  });

  describe.skip('POST /api/v1/projects/:project_id/palette', () => {
    it('should post a palette to a project', (done ) => {
      
    });
  });
});