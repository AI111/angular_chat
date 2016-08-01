'use strict';

describe('Component: ContactsComponent', function () {

  // load the controller's module
  beforeEach(module('angularChatApp'));

  var ContactsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ContactsComponent = $componentController('ContactsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
