'use strict';

describe('Component: ChatComponent', function () {

  // load the controller's module
  beforeEach(module('angularChatApp'));

  var ChatComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ChatComponent = $componentController('ChatComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
