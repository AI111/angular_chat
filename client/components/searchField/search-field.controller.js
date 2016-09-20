  'use strict';

  class SearchFieldController {
  //end-non-standard
  
  //start-non-standard
  constructor($timeout, $q, $log,$http) {
    this.$http=$http;
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

  sendInvite(invitedId){
    this.$log.debug('sendInvite',invitedId);
    this.$http.post('/api/users/invite/'+invitedId)
    .then((res)=>{
      this.$log.debug('sendInvite success',res);
    },(res)=>{
      this.$log.debug('sendInvite error',res);
    });
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
}


angular.module('angularChatApp')
.controller('SearchFieldController', SearchFieldController);
