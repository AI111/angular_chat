'use strict';
(function(){

  class DialogCtrl  {
    constructor($mdDialog){

     this.$mdDialog=$mdDialog;
   }
    // var self = this;
  //   // list of `state` value/display objects
  //   self.states        = loadAll();
  //   self.querySearch   = querySearch;
    // ******************************
    // Template methods
    // ******************************
    cancel($event) {
      this.$mdDialog.cancel();
    };
    finish($event) {
      this.$mdDialog.hide();
    };
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
     querySearch (query) {
      return query ? this.loadAll().filter( this.createFilterFor(query) ) : this.loadAll();
    }
    /**
     * Build `states` list of key/value pairs
     */
     loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
      Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
      Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
      Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
      North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
      South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
      Wisconsin, Wyoming';
      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }
    /**
     * Create filter function for a query string
     */
     createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }

  class ContactsComponent {
    constructor($mdDialog) {
     this.message = 'Hello';
     this.$mdDialog=$mdDialog;
   }
   addContact(ev){
     console.log(ev);

     this.$mdDialog.show({
      controller: DialogCtrl,
      controllerAs: 'dialogCtrl',
      templateUrl: 'app/contacts/dialog.html',
      parent: angular.element(document.body),//angular.element(document.querySelector('#contactContainer')),
      targetEvent: ev,
      clickOutsideToClose:true
    });
   }
   showAdvanced(ev) {
      //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      this.$mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/contacts/dialog1.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: false
      })
      .then(function(answer) {
        //$scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        //$scope.status = 'You cancelled the dialog.';
      });
      // $scope.$watch(function() {
      //   return $mdMedia('xs') || $mdMedia('sm');
      // }, function(wantsFullScreen) {
      //   $scope.customFullscreen = (wantsFullScreen === true);
      // });
    }
  }
  class DialogController{
    constructor($mdDialog){
      this.$mdDialog=$mdDialog;
    }
    hide(){
      this.$mdDialog.hide();
    };
    cancel() {
      this.$mdDialog.cancel();
    };
    answer(answer) {
      this.$mdDialog.hide(answer);
    };
  }

  angular.module('angularChatApp')
  .component('contacts', {
    templateUrl: 'app/contacts/contacts.html',
    controller: ContactsComponent
  });

})();
