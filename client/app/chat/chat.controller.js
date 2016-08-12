'use strict';
(function(){

class ChatComponent {
  constructor($routeParams,$log,$mdSidenav,$http) {
    this.$mdSidenav=$mdSidenav('left');
    this.$http=$http;
    this.message = 'Hello';
    this.$routeParams=$routeParams;
    this.$log=$log;
    this.messeges=[];
    this.roomId;
    
  }
  $onInit(){
  	this.$log.debug('Chat Component',this.$routeParams.id);
    for(var i =1;i<20;i++){
      this.messeges.push({text:('message '+i),creator:(i%2===0)});
    }
    this.$log.debug('messeges',this.messeges);
    this.roomId=this.$routeParams.id;
    this.$log.debug('Room ID',this.roomId);
    this.getMessages(this.roomId);

  }
  getMessages(id){
      this.$http.get('/api/rooms/'+id)
      .then((res)=>{
        this.$log.debug('getMessages success',res.data);
        this.messeges=res.data.messages;
      },(err)=>{
        this.$log.debug('getMessages error',err);
      });
    }
  addMessage(){
    this.messeges.push({
        text:"saadsdasdasdasdads",
        creator:true
      });
  }
  toggleSideNav(){
      this.$mdSidenav.toggle();
    }
}

angular.module('angularChatApp')
  .component('chat', {
    templateUrl: 'app/chat/chat.html',
    controller: ChatComponent
  });

})();
