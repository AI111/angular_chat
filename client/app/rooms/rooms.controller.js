'use strict';
(function(){

  class RoomDialogCtrl  {
    constructor($mdDialog,$http,$log,Room){
      this.$mdDialog=$mdDialog;
      this.$log=$log;
      this.$http=$http;
      this.$log.debug('RoomDialogCtrl',Room);
      this.asyncContacts  = new Array();
      this.name='';
      this.acceptName='Create';
      this.filterSelected = true;
      if (Room) {
        this.name=Room.name;
        this.asyncContacts=Room.users;
        this.acceptName='Update';
      }
    }


    delayedQuerySearch(criteria) {
      this.$log.debug('delayedQuerySearch',criteria);
      // cachedQuery = criteria;
      // if ( !pendingSearch || !debounceSearch() )  {
      //   cancelSearch();
      return this.$http.get('/api/users/me/contacts/'+criteria)
      .then((res)=>{
        this.$log.debug('getContacts success',res.data);
        return res.data;
      },(err)=>{
        this.$log.debug('getContacts error',err);
      });
        // return pendingSearch = $q(function(resolve, reject) {
        //   // Simulate async search... (after debouncing)
        //   cancelSearch = reject;
        //   $timeout(function() {
        //     resolve( self.querySearch() );
        //     refreshDebounce();
        //   }, Math.random() * 500, true)
        // });
      // }
      // return pendingSearch;
    }


    cancel($event) {
      this.$log.debug('RoomDialogCtrl cancel');
      this.$mdDialog.cancel();
    }
    create($event) {
      this.$log.debug('create',this.name,this.asyncContacts);
      this.$mdDialog.hide({name:this.name,users:this.asyncContacts.map(user=>{return user._id})});
    }
  }

  class RoomsComponent {
    constructor($http,$log,$mdDialog,$mdMedia,Auth, $mdSidenav) {
      this.title='Rooms';
      this.$mdSidenav=$mdSidenav('left');
      this.$http=$http;
      this.$log=$log;
      this.rooms;
      this.$mdDialog=$mdDialog;
      this.$mdMedia=$mdMedia;
      this.customFullscreen = false;
      this.currentUser = Auth.getCurrentUser();

    }
    $onInit(){
      this.$log.debug('currentUser',this.currentUser);
      this.getRooms();
      this.customFullscreen=this.$mdMedia('sm');
    }
    toggleSideNav(){
      this.$mdSidenav.toggle();
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
   addRoom(ev){
   	this.$log.debug(this.rooms);
    let $http = this.$http;
    this.$mdDialog.show({
      locals:{Room: null},
      controller: RoomDialogCtrl,
      controllerAs:'ctrl',
      templateUrl: 'app/rooms/room.dialog.html',
      parent: angular.element(document.body),
      targetEvent:ev,
      clickOutsideToClose:true,
      fullscreen: true // Only for -xs, -sm breakpoints.
    })
    .then((answer)=> {
      // $scope.status = 'You said the information was "' + answer + '".';
      this.$log.debug('addRoom answer',answer);
      this.$http.post('/api/rooms',answer)
      .then(res=>{
        this.$log.log('response ',res);
        this.rooms.push(res.data);
      },err=>{

      })
    }, ()=> {
      // $scope.status = 'You cancelled the dialog.';
    });
  }
  editRoom(ev,room){
    this.$log.debug('editRoom ',room);
    this.$mdDialog.show({
      locals:{Room: room},
      controller: RoomDialogCtrl,
      controllerAs:'ctrl',
      templateUrl: 'app/rooms/room.dialog.html',
      parent: angular.element(document.body),
      targetEvent:ev,
      clickOutsideToClose:true,
      fullscreen: true // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      // $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      // $scope.status = 'You cancelled the dialog.';
    });
  }
  deleteRoom(ev,room){
    this.$log.debug('deleteRoom',room);
    let confirm = this.$mdDialog.confirm()
    .title('Would you like to delete this Room')
          // .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');
          this.$mdDialog.show(confirm).then(()=> {
            this.$http.delete('/api/rooms/' + room._id)
            .then(res=>{
              this.$log.debug('deleteRoom res',res)
            },err=>{
              this.$log.debug('deleteRoom err',err)
            })
          }, ()=> {

          });
        }
        leaveRoom(ev,room){
          this.$log.debug('leaveRoom',room);
          let confirm = this.$mdDialog.confirm()
          .title('Would you like to leave this Room')
      // .textContent('All of the banks have agreed to forgive you your debts.')
      .ariaLabel('Lucky day')
      .targetEvent(ev)
      .ok('Leave')
      .cancel('Cancel');
      this.$mdDialog.show(confirm).then(()=> {
        this.$http.delete('/api/rooms/' + room._id+'/users/me')
        .then(res=>{
          this.$log.debug('leaveRoom res',res)
        },err=>{
          this.$log.debug('leaveRoom err',err)
        })
      }, ()=> {

      });
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
