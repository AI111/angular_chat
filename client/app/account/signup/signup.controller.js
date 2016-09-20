'use strict';

class SignupController {
  //end-non-standard

  constructor(Auth, $location,$mdSidenav) {
    this.Auth = Auth;
    this.$location = $location;
    this.$mdSidenav=$mdSidenav('left');
    this.title='Signup';
  }
    //start-non-standard

    toggleSideNav(){
      this.$mdSidenav.toggle();
    }
    register(form) {
      this.submitted = true;

      if (form.$valid) {
        this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        })
        .then(() => {
          // Account created, redirect to home
          this.$location.path('/');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
      }
    }
  }

  angular.module('angularChatApp')
  .controller('SignupController', SignupController);
