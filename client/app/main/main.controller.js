'use strict';

(function() {

  class MainController {

    constructor($mdSidenav) {
      this.title='Main page';
       this.$mdSidenav=$mdSidenav('left');
      // this.$http = $http;
      // this.socket = socket;
      // this.awesomeThings = [];

      // $scope.$on('$destroy', function() {
      //   socket.unsyncUpdates('thing');
      // });
    }
    toggleSideNav(){
      this.$mdSidenav.toggle();
    }

    // $onInit() {
    //   this.$http.get('/api/things')
    //     .then(response => {
    //       this.awesomeThings = response.data;
    //      // this.socket.syncUpdates('thing', this.awesomeThings);
    //     });
    // }

    // addThing() {
    //   if (this.newThing) {
    //     this.$http.post('/api/things', {
    //       name: this.newThing
    //     });
    //     this.newThing = '';
    //   }
    // }

    // deleteThing(thing) {
    //   this.$http.delete('/api/things/' + thing._id);
    // }
  }

  angular.module('angularChatApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
