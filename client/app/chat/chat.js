'use strict';

angular.module('angularChatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/chat/:id', {
        template: '<chat flex class="chat" layout="column"></chat>'
      });
  });
