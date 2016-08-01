'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var roomCtrlStub = {
  index: 'roomCtrl.index',
  show: 'roomCtrl.show',
  create: 'roomCtrl.create',
  update: 'roomCtrl.update',
  destroy: 'roomCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var roomIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './room.controller': roomCtrlStub
});

describe('Room API Router:', function() {

  it('should return an express router instance', function() {
    expect(roomIndex).to.equal(routerStub);
  });

  describe('GET /api/rooms', function() {

    it('should route to room.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'roomCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/rooms/:id', function() {

    it('should route to room.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'roomCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/rooms', function() {

    it('should route to room.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'roomCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/rooms/:id', function() {

    it('should route to room.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'roomCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/rooms/:id', function() {

    it('should route to room.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'roomCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/rooms/:id', function() {

    it('should route to room.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'roomCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
