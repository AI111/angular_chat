'use strict';
(function(){

  class ChatComponent {
    constructor($routeParams,$log,$mdSidenav,$http,Auth,$timeout,socket) {
      this.$mdSidenav=$mdSidenav('left');
      this.$http=$http;
      this.message = 'Hello';
      this.$routeParams=$routeParams;
      this.$log=$log;
      this.messeges=[];
      this.message='';
      this.users=new Map();
      this.roomId;
      this.Auth=Auth;
      this.currentUser = Auth.getCurrentUser();
      this.msgList= angular.element(document.querySelector('#chat-content'))[0];
      this.$timeout=$timeout;
      this.socket=socket;

    }
    $onInit(){
     this.$log.debug('Chat Component',this.$routeParams.id);
     this.$log.debug('messeges',this.messeges);
     this.roomId=this.$routeParams.id;
     this.$log.debug('Room ID',this.roomId);
     this.getUsers(this.roomId);
     this.$log.debug('currentUser',this.currentUser);
     this.$log.debug('Auth token ',this.Auth.getToken());

   }
   getUsers(id){
    this.$http.get('/api/rooms/'+id+'/users')
    .then((res)=>{
      this.$log.debug('getUsers success',res.data);
      res.data.forEach(user=>this.users.set(user._id,user));
      this.$log.debug('Map',this.users);
      this.getMessages(id);
    },(err)=>{
      this.$log.debug('getUsers error',err);
    });
  }
  getMessages(id){
    this.$http.get('/api/rooms/'+id+'/messages')
    .then((res)=>{
      this.messeges=res.data;
      this.messeges.forEach(msg=>{msg.sender=this.users.get(msg.sender)});
      this.$log.debug('getMessages success',this.messeges);
    },(err)=>{
      this.$log.debug('getMessages error',err);
    });
  }
  scroll(list){
    this.$timeout(function() {
      console.log('timeout');
      list.scrollTop = list.scrollHeight;
    }, 100);
    this.$log.debug('scroll ',this.msgList);
    
  // this.msgList.scrollTop=500;
}
addMessage(msg){
  if(msg.length>0){
    this.messeges.push({
      text:msg,
      sender:{_id:this.currentUser._id,img:this.currentUser.img,name:this.currentUser.name},
      sendTime:new Date()
    });
    this.message='';
    this.scroll(this.msgList);
  }
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
