'use strict';

class LoginController {
  constructor(Auth, $location, $mdSidenav) {
    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.title='Login';
    this.Auth = Auth;
    this.$location = $location;
    this.$mdSidenav=$mdSidenav('left');
  }
  toggleSideNav(){
    this.$mdSidenav.toggle();
  }
  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
          // Logged in, redirect to home
          this.$location.path('/');
        })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('angularChatApp')
.controller('LoginController', LoginController);
