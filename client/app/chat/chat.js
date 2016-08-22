'use strict';

angular.module('angularChatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/chat/:id', {
        template: '<chat flex  layout="row"></chat>'
      });
  });
