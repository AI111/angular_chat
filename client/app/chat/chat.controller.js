'use strict';
(function(){

class ChatComponent {
  constructor($routeParams,$log) {
    this.message = 'Hello';
    this.$routeParams=$routeParams;
    this.$log=$log;
    this.messeges=[];
    
  }
  $onInit(){
  	this.$log.debug('Chat Component',this.$routeParams.id);
    for(var i =1;i<20;i++){
      this.messeges.push({text:('message '+i),creator:(i%2===0)});
    }
    this.$log.debug('messeges',this.messeges);
  }
  addMessage(){
    this.messeges.push({
        text:"saadsdasdasdasdads",
        creator:true
      });
  }
}

angular.module('angularChatApp')
  .component('chat', {
    templateUrl: 'app/chat/chat.html',
    controller: ChatComponent
  });

})();
