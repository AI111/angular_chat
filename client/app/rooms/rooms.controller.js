'use strict';
(function(){

class RoomsComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('angularChatApp')
  .component('rooms', {
    templateUrl: 'app/rooms/rooms.html',
    controller: RoomsComponent
  });

})();
