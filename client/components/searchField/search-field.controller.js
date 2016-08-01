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
  $onInit() {
    // this.findUserByName('te')
    // .then(response => {
    //   console.log(response.data);
    //  this.$log.info(response.data);
    // });
    this.findUserByName('test').then((data)=> this.$log.info(data));
    
  }
  newState(state) {
    alert("Sorry! You'll need to create a Constituion for " + state + " first!");
  }

  findUserByName(query){
    return this.$http.get('/api/users/name/'+query);
      // var deferred = $q.defer();
      //       $http.get('/api/users/name/'+query)
      //       .then(function successCallback(response) {
      //       // this callback will be called asynchronously
      //       // when the response is available
      //       this.$log.debug(response)

      //          deferred.resolve(response);
      //     }, function errorCallback(response) {

      //       // called asynchronously if an error occurs
      //       // or server returns response with an error status.
      //       this.$log.info(response)

      //        deferred.resolve(response);
      //     });

      //       return deferred.promise;
    }
    find(query){
      return this.$http.get('/api/users/name/'+query)
      .then(function(response) {
       console.log('querySearch',response.data);
       return response.data;
          }, function(response){
            // something went wrong
           return this.$q.reject(response.data);
          });
    }

    querySearch (query) {
      this.$log.debug('querySearch',query);
      if(query){
        // this.findUserByName(query).then(
        //   res =>{
        //     this.$log.debug('querySearch',res.data);
        //     return res.data;
        //   }, err=>{
        //     this.$log.error('querySearch',err);
        //     return $q.reject(res.data);
        //   });
        return this.find(query);
      }
      return [];
      // var results = query ? this.loadAll().filter( this.createFilterFor(query) ) : this.loadAll(),
      // deferred;
      // if (this.simulateQuery) {
      //   var deferred = this.$q.defer();
      //   this.$timeout(function () { deferred.resolve( results ); }, 1 * 1000, false);
      //   return deferred.promise;
      // } else {
      //   return results;
      // }
    }
    searchTextChange(text) {
      this.$log.info('Text changed to ' + text);
    }
    selectedItemChange(item) {
      this.$log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `states` list of key/value pairs
     */
     loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
      Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
      Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
      Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
      North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
      South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
      Wisconsin, Wyoming';
      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }
    /**
     * Create filter function for a query string
     */
     createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }


  angular.module('angularChatApp')
  .controller('SearchFieldController', SearchFieldController);
