'use strict';

var app = require('../..');
import request from 'supertest';

var newRoom;

describe('Room API:', function() {

  describe('GET /api/rooms', function() {
    var rooms;

    beforeEach(function(done) {
      request(app)
        .get('/api/rooms')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          rooms = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(rooms).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/rooms', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/rooms')
        .send({
          name: 'New Room',
          info: 'This is the brand new room!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newRoom = res.body;
          done();
        });
    });

    it('should respond with the newly created room', function() {
      expect(newRoom.name).to.equal('New Room');
      expect(newRoom.info).to.equal('This is the brand new room!!!');
    });

  });

  describe('GET /api/rooms/:id', function() {
    var room;

    beforeEach(function(done) {
      request(app)
        .get('/api/rooms/' + newRoom._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          room = res.body;
          done();
        });
    });

    afterEach(function() {
      room = {};
    });

    it('should respond with the requested room', function() {
      expect(room.name).to.equal('New Room');
      expect(room.info).to.equal('This is the brand new room!!!');
    });

  });

  describe('PUT /api/rooms/:id', function() {
    var updatedRoom;

    beforeEach(function(done) {
      request(app)
        .put('/api/rooms/' + newRoom._id)
        .send({
          name: 'Updated Room',
          info: 'This is the updated room!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRoom = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRoom = {};
    });

    it('should respond with the updated room', function() {
      expect(updatedRoom.name).to.equal('Updated Room');
      expect(updatedRoom.info).to.equal('This is the updated room!!!');
    });

  });

  describe('DELETE /api/rooms/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/rooms/' + newRoom._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when room does not exist', function(done) {
      request(app)
        .delete('/api/rooms/' + newRoom._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
