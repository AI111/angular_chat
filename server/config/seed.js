/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

 'use strict';
 import Thing from '../api/thing/thing.model';
 import User from '../api/user/user.model';
import Invite from '../api/user/user.invite.model';

 Thing.find({}).remove()
 .then(() => {
  Thing.create({
    name: 'Development Tools',
    info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
    'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
    'Stylus, Sass, and Less.'
  }, {
    name: 'Server and Client integration',
    info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
    'AngularJS, and Node.'
  }, {
    name: 'Smart Build System',
    info: 'Build system ignores `spec` files, allowing you to keep ' +
    'tests alongside code. Automatic injection of scripts and ' +
    'styles into your index.html'
  }, {
    name: 'Modular Structure',
    info: 'Best practice client and server structures allow for more ' +
    'code reusability and maximum scalability'
  }, {
    name: 'Optimized Build',
    info: 'Build process packs up your templates as a single JavaScript ' +
    'payload, minifies your scripts/css/images, and rewrites asset ' +
    'names for caching.'
  }, {
    name: 'Deployment Ready',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
    'and openshift subgenerators'
  });
});
  Invite.find({}).remove();
 User.find({}).remove()
 .then(() => {
  User.create(
  {
    provider: 'local',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    name: 'A test User 2',
    email: 'test2@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    name: 'TEST User 3',
    email: 'test3@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'Test User 4',
    email: 'test4@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'Tes User 5',
    email: 'test5@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'est User 6',
    email: 'test6@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 7',
    email: 'test7@example.com',
    password: 'test'
  },


  {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin'
  })
  .then(() => {
    console.log('finished populating users');
  });
});
