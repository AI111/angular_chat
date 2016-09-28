'use strict';

angular.module('angularChatApp',
	['angularChatApp.auth',
	'angularChatApp.admin',
  'angularChatApp.constants',
  'angularChatApp.navDrawer',
  'angularChatApp.oauthButtons',
  'angularChatApp.videoConferance',
  'angularChatApp.videoStream',
    'ngFileUpload',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngMessages',
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

Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto;
  return obj;
};
