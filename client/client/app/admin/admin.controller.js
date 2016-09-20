'use strict';

(function() {

  class AdminController {
    constructor(User,$log,$mdSidenav) {
      // Use the User $resource to fetch all users
      this.$mdSidenav=$mdSidenav('left');
      this.users = User.query();
      $log.debug('users',this.users);
    }
    toggleSideNav(){
      this.$mdSidenav.toggle();
    }
    delete(user) {
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    }
  }

  angular.module('angularChatApp.admin')
    .controller('AdminController', AdminController);
})();
