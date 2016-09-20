'use strict';

describe('Component: RoomsComponent', function () {

  // load the controller's module
  beforeEach(module('angularChatApp'));

  var RoomsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    RoomsComponent = $componentController('RoomsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
