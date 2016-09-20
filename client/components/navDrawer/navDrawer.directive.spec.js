'use strict';

describe('Directive: navDrawer', function () {

  // load the directive's module and view
  beforeEach(module('angularChatApp.navDrawer'));
  beforeEach(module('components/navDrawer/navDrawer.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nav-drawer></nav-drawer>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the navDrawer directive');
  }));
});
