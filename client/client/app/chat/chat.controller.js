'use strict';
(function(){

  class ChatComponent {
    constructor($routeParams,$log,$window,$mdSidenav,$http,Auth,$timeout,socket,$scope) {
      this.$mdSidenav=$mdSidenav;
      this.$http=$http;
      this.$window=$window;
      this.$routeParams=$routeParams;
      this.$log=$log;
      this.messeges=[];
      this.message='';
      this.usersMap=new Map();
      this.users=new Array();
      this.onlineUsers=new Map();
      this.roomId;
      this.Auth=Auth;
      this.currentUser = Auth.getCurrentUser();
      this.msgList= angular.element(document.querySelector('#chat-content'))[0];
      this.$timeout=$timeout;
      this.socket=socket.socket;
      $scope.$on('$destroy', ()=> {
        this.$log.debug('on destroy');
        this.onDestroy(this.socket);
      });
    }
    $onInit(){
      this.$log.debug('Chat Component',this.$routeParams.id);
      this.$log.debug('messeges',this.messeges);
      this.roomId=this.$routeParams.id;
      this.$log.debug('Room ID',this.roomId);
      this.getUsers(this.roomId);
      this.$log.debug('currentUser',this.currentUser);
      this.$log.debug('Auth token ',this.Auth.getToken());
      this.joinRoom(this.roomId);
      console.log(this.$mdSidenav);
      this.leftSideNav=this.$mdSidenav('left');
      // this.rightSideNav=this.$mdSidenav('right');
      this.setListeners();
    }
    onDestroy(socket){
      socket.removeAllListeners('add msg');
      socket.removeAllListeners('room error');
      socket.removeAllListeners('user connect');
      socket.removeAllListeners('user disconnect');

    }
    joinRoom(room_id){
      this.socket.emit('connect to room',room_id,(conected_users)=>{
        this.$log.debug('connect to room clb',conected_users);
        conected_users.forEach(u=>this.onlineUsers.set(u.key,u.value));
        this.$log.debug('online usrs map',this.onlineUsers);
      });
      this.socket.emit('get users',(conected_users)=>{
        this.$log.debug('get users',conected_users);
      })
    }
    isOnline(user){
      return this.onlineUsers.has(user._id);
    }
    setListeners(){
      this.socket.on('add msg',msg=>{
        this.reciveMessage(msg);
        this.$log.debug('add msg',msg);
      });
      this.socket.on('room error',msg=>{
        this.$log.debug('room error',msg);
      });
      this.socket.on('user connect',msg=>{
        this.$log.debug('user connect',msg);
        this.onlineUsers.set(msg);
      });
      this.socket.on('user disconnect',msg=>{
        this.$log.debug('user disconnect',msg);
        this.onlineUsers.delete(msg);
      });
    }
    sendMessage(msg){
      this.socket.emit('broadcast msg',msg,(status,resp)=>{
        this.$log.debug('broadcast msg',status,resp);
        this.messeges.push(this.transformMessage(resp));
        this.scroll(this.msgList);
      })
    }
    reciveMessage(msg){
      this.messeges.push(this.transformMessage(msg));
      this.scroll(this.msgList);
    }
    getUsers(id){
      this.$http.get('/api/rooms/'+id+'/users')
      .then((res)=>{
        this.$log.debug('getUsers success',res.data);
        res.data.forEach(user=>this.usersMap.set(user._id,user));
        this.$log.debug('Map',this.usersMap);
        this.users=res.data;
        this.getMessages(id);
      },(err)=>{
        this.$log.debug('getUsers error',err);
      });
    }
    getMessages(id){
      this.$http.get('/api/rooms/'+id+'/messages')
      .then((res)=>{
        this.messeges=res.data;
        this.messeges.forEach(msg=>{msg.sender=this.usersMap.get(msg.sender)});
        this.$log.debug('getMessages success',this.messeges);
      },(err)=>{
        this.$log.debug('getMessages error',err);
      });
    }
    startVideoCall(){
      this.$window.open('/conference/'+this.roomId);
    }
    transformMessage(message){
      let result = message;
      result.sender={_id:message.sender,name:this.usersMap.get(message.sender).name,img:this.usersMap.get(message.sender).img}
      return result
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
        this.sendMessage(msg);
        this.message='';
      }
    }
    toggleSideNav(){
      this.leftSideNav.toggle();
    }
    toggleRightSideNav(){
      this.rightSideNav=this.$mdSidenav('right');
      this.$log.debug('toggleRightSideNav',this.rightSideNav)
      // this.rightSideNav.toggle();
      this.rightSideNav.open();

    }

  }

  angular.module('angularChatApp')
  .component('chat', {
    templateUrl: 'app/chat/chat.html',
    controller: ChatComponent
  });

})();
