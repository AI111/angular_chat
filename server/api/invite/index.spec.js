'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var inviteCtrlStub = {
  index: 'inviteCtrl.index',
  show: 'inviteCtrl.show',
  create: 'inviteCtrl.create',
  upsert: 'inviteCtrl.upsert',
  patch: 'inviteCtrl.patch',
  destroy: 'inviteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var inviteIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './invite.controller': inviteCtrlStub
});

describe('Invite API Router:', function() {
  it('should return an express router instance', function() {
    expect(inviteIndex).to.equal(routerStub);
  });

  describe('GET /api/invites', function() {
    it('should route to invite.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'inviteCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/invites/:id', function() {
    it('should route to invite.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'inviteCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/invites', function() {
    it('should route to invite.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'inviteCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/invites/:id', function() {
    it('should route to invite.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'inviteCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/invites/:id', function() {
    it('should route to invite.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'inviteCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/invites/:id', function() {
    it('should route to invite.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'inviteCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
