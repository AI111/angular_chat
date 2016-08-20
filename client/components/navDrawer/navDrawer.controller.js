  'use strict';

  class NavDrawerController {
  //end-non-standard
  
  //start-non-standard
  constructor(Auth,$location) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.authMenu=[
            {
              title: 'Login',
              path: '/login',
              visible : () => {
                return !this.isLoggedIn();
              },
              icon: '/assets/icons/ic_login_24px.svg'
            },
            {
              title: 'Logout',
              path: '/logout',
               visible :()=>{
                return this.isLoggedIn();
              },
              icon: '/assets/icons/ic_logout_24px.svg'
            },
            {
              title: 'Setting',
              path: '/settings',
               visible :()=>{
                return this.isLoggedIn();
              },
              icon: '/assets/icons/ic_settings_black_24px.svg'
            },
            {
              title: 'Signup',
              path: '/signup',
               visible : ()=> {
                return !this.isLoggedIn();
              },
              icon: '/assets/icons/ic_assignment_ind_black_24px.svg'
            },
            {
              title: 'Setting',
              path: '/setting',
               visible : ()=> {
                return this.isAdmin();
              },
              icon: '/assets/icons/ic_assignment_ind_black_24px.svg'
            }
  ];
  this.menu = [
          {
            title: 'Home',
            path: '/',
            icon: '/assets/icons/ic_home_24px.svg'
          },
          {
            title: 'Rooms',
            path: '/rooms',
            icon: '/assets/icons/ic_note_black_24px.svg'
          },
          {
            title: 'Chat',
            path: '/chat',
            icon: '/assets/icons/ic_note_black_24px.svg'
          },
          {
            title: 'Contacts',
            path: '/contacts',
            icon: '/assets/icons/ic_contacts_black_24px.svg'
          }
  ];
  }
    isActive(route) {
    return route === this.$location.path();
  }

}

angular.module('angularChatApp')
.controller('NavDrawerController', NavDrawerController);
