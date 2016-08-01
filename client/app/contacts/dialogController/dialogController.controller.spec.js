'use strict';

describe('Controller: DialogControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('angularChatApp'));

  var DialogControllerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogControllerCtrl = $controller('DialogControllerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
