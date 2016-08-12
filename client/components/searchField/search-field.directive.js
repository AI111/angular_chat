'use strict';

angular.module('angularChatApp.searchField',[])
  .directive('searchField', function () {
    return {
      templateUrl: 'components/searchField/search-field.html',
      controller:'SearchFieldController',
      controllerAs: 'SearchCtrl',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });
