'use strict';

angular.module('angularChatApp', 
	['angularChatApp.auth', 
	'angularChatApp.admin',
  'angularChatApp.constants', 
  // 'angularChatApp.searchUser',
  'ngCookies', 
  'ngResource', 
  'ngSanitize', 
  'ngRoute',
  'btford.socket-io', 
  'validation.match',
  'ngMaterial',
  'ngMdIcons'
  ])
.config(function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
});
