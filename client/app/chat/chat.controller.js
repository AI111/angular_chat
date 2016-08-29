'use strict';
(function(){

  class ChatComponent {
    constructor($routeParams,$log,$mdSidenav,$http,Auth,$timeout,socket) {
      this.$mdSidenav=$mdSidenav;
      this.$http=$http;
      this.message = 'Hello';
      this.$routeParams=$routeParams;
      this.$log=$log;
      this.messeges=[];
      this.message='';
      this.usersMap=new Map();
      this.users=new Array();
      this.roomId;
      this.Auth=Auth;
      this.currentUser = Auth.getCurrentUser();
      this.msgList= angular.element(document.querySelector('#chat-content'))[0];
      this.$timeout=$timeout;
      this.socket=socket.socket;

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
      this.rightSideNav=this.$mdSidenav('right');
      this.setListeners();
    }
    joinRoom(room_id){
      this.socket.emit('connect to room',room_id,(conected_users)=>{
        this.$log.debug('connect to room clb',conected_users);
      });
      this.socket.emit('get users',(conected_users)=>{
        this.$log.debug('get users',conected_users);
      })
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
      });
      this.socket.on('user disconnect',msg=>{
        this.$log.debug('user disconnect',msg);
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
      this.rightSideNav.toggle();
    }

  }

  angular.module('angularChatApp')
    .component('chat', {
      templateUrl: 'app/chat/chat.html',
      controller: ChatComponent
    });

})();
