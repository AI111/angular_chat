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
    this.users=new Map();
    this.roomId;

  }
  $onInit(){
  	this.$log.debug('Chat Component',this.$routeParams.id);
    this.$log.debug('messeges',this.messeges);
    this.roomId=this.$routeParams.id;
    this.$log.debug('Room ID',this.roomId);
    this.getMessages(this.roomId);
    this.getUsers(this.roomId);

  }
  getUsers(id){
      this.$http.get('/api/rooms/'+id+'/users')
      .then((res)=>{
        this.$log.debug('getUsers success',res.data);
        res.data.forEach(user=>this.users.set(user._id,{img:user.img,name:user.name}));
      },(err)=>{
        this.$log.debug('getUsers error',err);
      });
    }
  getMessages(id){
      this.$http.get('/api/rooms/'+id+'/messages')
      .then((res)=>{
        this.$log.debug('getMessages success',res.data);
        this.messeges=res.data;
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
