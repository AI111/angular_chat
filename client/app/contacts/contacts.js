'use strict';

angular.module('angularChatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/contacts', {
        template: '<contacts></contacts>'
      });
  });
