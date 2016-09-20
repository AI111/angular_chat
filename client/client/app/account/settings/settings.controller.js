'use strict';

class SettingsController {

  constructor(Auth,$mdSidenav) {
    this.Auth = Auth;
    this.$mdSidenav = $mdSidenav('left');
  }
  toggleSideNav(){
    this.$mdSidenav.toggle();
  }
  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
      .then(() => {
        this.message = 'Password successfully changed.';
      })
      .catch(() => {
        form.password.$setValidity('mongoose', false);
        this.errors.other = 'Incorrect password';
        this.message = '';
      });
    }
  }
}

angular.module('angularChatApp')
.controller('SettingsController', SettingsController);