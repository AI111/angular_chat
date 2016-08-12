'use strict';

angular.module('angularChatApp', 
	['angularChatApp.auth', 
	'angularChatApp.admin',
  'angularChatApp.constants', 
  'angularChatApp.navDrawer',
  'angularChatApp.oauthButtons',
  'angularChatApp.searchField',
  'angularChatApp.oauthButtons',
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
