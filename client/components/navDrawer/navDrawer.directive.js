'use strict';

angular.module('angularChatApp.navDrawer',[])
  .directive('navDrawer', function () {
    return {
      templateUrl: 'components/navDrawer/navDrawer.html',
      restrict: 'E',
      controller:'NavDrawerController',
      controllerAs: 'drawer',
      link: function (scope, element, attrs) {
      }
    };
  });
