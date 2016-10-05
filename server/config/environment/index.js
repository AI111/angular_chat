'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,


  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'angular-chat-secret'
  },
  user: {
    photo: '5cc6d9872253e554e2c56fb80581753c.jpg',
    url: '/api/users/me/photo/',
    fileDir: '/uploads/'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || '344233342580593',
    clientSecret: process.env.FACEBOOK_SECRET || '92c7cdc53e8ac76318d97c169aef5262',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'KzBx42dNsSR4VihiNE1bgmHHt',
    clientSecret: process.env.TWITTER_SECRET || 'JRl1LQYiA2EjzLvR6Hzn2i5aEoyvqYGrZ5OB4oCiY74JJFVqnC',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || '261916049596-e27nsq9e3hsu8nukehtu32mfampun9nm.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'E7HsCkXK61aaos6k6GJEMcSC',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});
