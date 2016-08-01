'use strict';

describe('Directive: searchField', function () {

  // load the directive's module and view
  beforeEach(module('angularChatApp.searchField'));
  beforeEach(module('components/searchField/searchField.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<search-field></search-field>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the searchField directive');
  }));
});
