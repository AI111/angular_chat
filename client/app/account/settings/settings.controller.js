'use strict';

class SettingsController {

  constructor(Auth, $mdSidenav, Upload, $timeout, $log) {
    this.$log = $log;
    this.$timeout = $timeout;
    this.Upload = Upload
    this.Auth = Auth;
    this.$mdSidenav = $mdSidenav('left');
  }
  toggleSideNav(){
    this.$mdSidenav.toggle();
  }

  changePhoto(file) {
    this.$log.debug('changePhoto', file);
    this.Upload.upload({
      url: 'api/users/photo',
      data: {image: file}
    }).then(function (resp) {
      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
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
