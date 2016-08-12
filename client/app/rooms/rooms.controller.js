'use strict';
(function(){

class RoomsComponent {
  constructor($http,$log) {
    this.$http=$http;
    this.$log=$log;
  	this.rooms;
  }
  $onInit(){
  	this.getRooms();
  }
   getRooms(){
      this.$http.get('/api/users/me/rooms')
     .then((res)=>{
      this.$log.debug('getRooms success',res.data);
      this.rooms=res.data;
    },(err)=>{
      this.$log.debug('getRooms error',err);
    });
   }
   formatUsers(){
   	return function(input){
   		console.log('felter');
   		return 'hello';
   	}
   	// var string='';
   	// users.forEach(user=>string+=(user.name+', ')
   	// 	return 
   }
   addRoom(event){
   	this.$log.debug(this.rooms);
   }
}

angular.module('angularChatApp')
  .component('rooms', {
    templateUrl: 'app/rooms/rooms.html',
    controller: RoomsComponent
  }).filter('usersList', ()=> {
  return (users)=>{
    var string=users[0].name;
    for(let i=1;i<users.length;i++){
      string+=', '+users[i].name;
    }
    return string;
  };
})

})();
