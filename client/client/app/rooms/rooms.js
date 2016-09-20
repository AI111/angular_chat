'use strict';

angular.module('angularChatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/rooms', {
        template: '<rooms layout="column"></rooms>'
      });
  });
