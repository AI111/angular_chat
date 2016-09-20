'use strict';

angular.module('angularChatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/conference/:roomId', {
        template: '<conference flex  layout="column"></conference>'
      })
      .when('/conference', {
        template: '<conference flex  layout="column"></conference>'
      });
  });
