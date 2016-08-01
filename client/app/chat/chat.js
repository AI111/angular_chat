'use strict';

angular.module('angularChatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/chat', {
        template: '<chat></chat>'
      });
  });
