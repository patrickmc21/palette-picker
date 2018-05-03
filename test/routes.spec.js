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
        response.body[0].name.should.equal('mountain');
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
        response.body[0].name.should.equal('warm');
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('color1');
        response.body[0].color1.should.equal('red');
        response.body[0].should.have.property('color2');
        response.body[0].color2.should.equal('white');
        response.body[0].should.have.property('color3');
        response.body[0].color3.should.equal('blue');
        response.body[0].should.have.property('color4');
        response.body[0].color4.should.equal('green');
        response.body[0].should.have.property('color5');
        response.body[0].color5.should.equal('orange');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        done();
      })
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should post a project to the database', (done) => {
      chai.request(app)
      .post('/api/v1/projects')
      .send({
        name: 'warm'
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

  describe('POST /api/v1/projects/:project_id/palette', () => {
    it('should post a palette to a project', (done ) => {
      chai.request(app)
        .post('/api/v1/projects/1/palette')
        .send({
          name:'fun',
          color1: 'purple',
          color2: 'teal',
          color3: 'flannel',
          color4: 'plaid',
          color5: 'camo'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(3);
          done();
        });
    });

    it('should not post a palette if body incomplete', (done) => {
      chai.request(app)
        .post('/api/v1/projects/1/palette')
        .send({
          name:'fun',
          color1: null,
          color2: 'teal',
          color3: 'flannel',
          color4: 'plaid',
          color5: 'camo'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Please include a valid palette');
          done();
        });
    });
  });
});