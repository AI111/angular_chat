'use strict';
(function(){

  class DialogCtrl  {
    constructor($timeout, $q, $log,$http,$mdDialog) {
      this.$http=$http;
      this.$mdDialog=$mdDialog;
      this.$timeout=$timeout;
      this.$q=$q;
      this.$log=$log;
      this.simulateQuery = true;
      this.isDisabled    = false;
      this.noCache = false;
      this.searchText;
      this.selectedItem;
      this.selectedItems=[];
    }

    sendInvite(invitedId,message,err){
      this.$log.debug('sendInvite',invitedId,message);
      this.$http.post('/api/invites/',{
        to:invitedId,
        message:message
      }).then((res)=>{
        this.$log.debug('sendInvite success',res);
        this.cancel();
      },(res)=>{
        this.$log.debug('sendInvite error',res);
      });
    }
    isChecked(err){
      return !angular.equals({}, err);
    }
    findUserByName(query){
      return this.$http.get('/api/users/name/'+query)
        .then((response)=> {
          this.$log.debug('findUserByName',response.data);
          return response.data;
        }, (response)=>{
          // something went wrong
          return this.$q.reject(response.data);
        });
    }

    querySearch (query) {
      this.$log.debug('querySearch',query);
      if(query){
        return this.findUserByName(query);
      }
      return [];
    }
    searchTextChange(text) {
      this.$log.info('Text changed to ' + text);
    }
    selectedItemChange(item) {
      this.$log.info('Item changed to ' + JSON.stringify(item));
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
      this.showSearch=false;
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
        fullscreen: true,
        clickOutsideToClose:true
      });
    }
    openContact(contact){
      
    }
    acceptInvite(id,index){
      this.$http.post('/api/invites/'+id+'/accept').then(res=>{
        this.$log.debug('acceptInvite success',res);
        this.invites.splice(index,1);
        this.getContacts();
      },err=>{
        this.$log.debug('acceptInvite error',err);
      })
    }
    rejectInvite(id,index){
      this.$http.delete('/api/invites/'+id).then(
        res=>{
          this.$log.debug('acceptInvite success',res);
          this.invites.splice(index,1);
        },err=>{
          this.$log.debug('acceptInvite error',err);
        }
      )
    }

  }


  angular.module('angularChatApp')
    .component('contacts', {
      templateUrl: 'app/contacts/contacts.html',
      controller: ContactsComponent
    });

})();
