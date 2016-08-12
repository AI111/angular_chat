'use strict';
(function(){

  class DialogCtrl  {
    constructor($mdDialog){
      this.$mdDialog=$mdDialog;
    }


    cancel($event) {
      this.$mdDialog.cancel();
    }
    finish($event) {
      this.$mdDialog.hide();
    }
  }

  class ContactsComponent {
    constructor($mdDialog,$http,$log,$mdSidenav,ColorUtil) {
      this.$mdSidenav=$mdSidenav('left');
      this.ColorUtil=ColorUtil;
      this.isGrid=false;
      this.contacts;
      this.invites;
      this.message = 'Hello';
      this.$mdDialog=$mdDialog;
      this.$http=$http;
      this.$log=$log;
    }
    toggleSideNav(){
      this.$mdSidenav.toggle();
    }
    $onInit(){
      this.getContacts();
      this.getInvites();
    }
    getContacts(){
      this.$http.get('/api/users/me/contacts')
      .then((res)=>{
        this.$log.debug('getContacts success',res.data);
        this.contacts=res.data;
        this.contacts.forEach(user=>user.color=this.ColorUtil.randomColor());
      },(err)=>{
        this.$log.debug('getContacts error',err);
      });
    }
    getInvites(){
      this.$http.get('/api/users/me/invites')
     .then((res)=>{
      this.$log.debug('getInvites success',res.data);
      this.invites=res.data;
    },(err)=>{
      this.$log.debug('getInvites error',err);
    });
   }
   addContact(ev){
     console.log(ev);

     this.$mdDialog.show({
      controller: DialogCtrl,
      controllerAs: 'dialogCtrl',
      templateUrl: 'app/contacts/dialog.html',
      parent: angular.element(document.body),//angular.element(document.querySelector('#contactContainer')),
      targetEvent: ev,
      clickOutsideToClose:true
    });
   }

 }

angular.module('angularChatApp')
.component('contacts', {
  templateUrl: 'app/contacts/contacts.html',
  controller: ContactsComponent
});

})();
