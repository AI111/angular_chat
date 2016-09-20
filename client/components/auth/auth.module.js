'use strict';

angular.module('angularChatApp.auth', ['angularChatApp.constants', 'angularChatApp.util',
    'ngCookies', 'ngRoute'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
