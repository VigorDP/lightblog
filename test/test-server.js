process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../app');
var Blob = require("../server/models/blob");

var should = chai.should();
chai.use(chaiHttp);


describe('Users', function() {

  User.collection.drop();

  beforeEach(function(done){
    var newUser = new User({
      name: 'Bat',
      lastName: 'man'
    });
    newUser.save(function(err) {
      done();
    });
  });
  afterEach(function(done){
    User.collection.drop();
    done();
  });

  it('should list ALL users on /blobs GET', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('lastName');
        res.body[0].name.should.equal('Bat');
        res.body[0].lastName.should.equal('man');
        done();
      });
  });

  it('should list a SINGLE user on /blob/<id> GET', function(done) {
      var newUser = new User({
        name: 'Super',
        lastName: 'man'
      });
      newUser.save(function(err, data) {
        chai.request(server)
          .get('/user/'+data.id)
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('name');
            res.body.should.have.property('lastName');
            res.body.name.should.equal('Super');
            res.body.lastName.should.equal('man');
            res.body._id.should.equal(data.id);
            done();
          });
      });
  });

  it('should add a SINGLE user on /users POST', function(done) {
    chai.request(server)
      .post('/users')
      .send({'name': 'Java', 'lastName': 'Script'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('SUCCESS');
        res.body.SUCCESS.should.be.a('object');
        res.body.SUCCESS.should.have.property('name');
        res.body.SUCCESS.should.have.property('lastName');
        res.body.SUCCESS.should.have.property('_id');
        res.body.SUCCESS.name.should.equal('Java');
        res.body.SUCCESS.lastName.should.equal('Script');
        done();
      });
  });

  it('should update a SINGLE user on /user/<id> PUT', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        chai.request(server)
          .put('/user/'+res.body[0]._id)
          .send({'name': 'Spider'})
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('UPDATED');
            response.body.UPDATED.should.be.a('object');
            response.body.UPDATED.should.have.property('name');
            response.body.UPDATED.should.have.property('_id');
            response.body.UPDATED.name.should.equal('Spider');
            done();
        });
      });
  });

  it('should delete a SINGLE user on /user/<id> DELETE', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        chai.request(server)
          .delete('/user/'+res.body[0]._id)
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('REMOVED');
            response.body.REMOVED.should.be.a('object');
            response.body.REMOVED.should.have.property('name');
            response.body.REMOVED.should.have.property('_id');
            response.body.REMOVED.name.should.equal('Bat');
            done();
        });
      });
  });

});
