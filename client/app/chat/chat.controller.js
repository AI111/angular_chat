'use strict';
(function(){

class ChatComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('angularChatApp')
  .component('chat', {
    templateUrl: 'app/chat/chat.html',
    controller: ChatComponent
  });

})();
