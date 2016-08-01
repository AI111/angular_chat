'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import Invite from './user.invite.model';
var debug = require('debug')('user.controller')
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
 export function index(req, res) {
  return User.find({}, '-salt -password').exec()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(handleError(res));
}

/**
 * Creates a new user
 */
 export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
  .then(function(user) {
    var token = jwt.sign({ _id: user._id }, config.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({ token });
  })
  .catch(validationError(res));
}

/**
 * Get a single user
 */
 export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
  .then(user => {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  })
  .catch(err => next(err));
}

export function findByEmail(req, res, next) {
  var email = req.params.email;

  return User.find({"email": '/'+email+'/'}).select("name email img").exec()
  .then(users => {
    if (!users) {
      return res.status(404).end();
    }
    res.status(200).json(users);
  })
  .catch(err => next(err));
}

export function findByName(req, res, next) {
  var name = req.params.name;
  // Log.info('findByName ',name)
  return User.find({"name": new RegExp(name, 'i')}).select("name email img").exec()
  .then(users => {
    if (!users) {
      return res.status(404).end();
    }
    res.status(200).json(users);
    // Log.info('findByName response',users);
  })
  .catch(err => next(err));
}
export function inviteUser(req, res,next){
  var invitedUser=req.params.user_id;
  var userId = req.user._id;
  var newInvite = new  Invite({
    message:'Add friend',
    from:userId,
    to:invitedUser
  });
  debug('inviteUser',newInvite);
  // Log.debug('inviteUser',newInvite)
  newInvite.save()
  .then(function(err) {
    if (err) return handleError(err);
    User.findById(userId).exec()
      .then(user => {
          if (user) {
            debug('inviteUser find user ',user);
            user.invites.push = newInvite;
            return user.save()
            .then(() => {
              debug('inviteUser add invite to user ',user);
              res.status(204).end();
            })
            .catch(validationError(res));
          } else {
            return res.status(401).end();
          }
      });
    res.json({ token });
  })
  .catch(validationError(res));

}
/**
 * Deletes a user
 * restriction: 'admin'
 */
 export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
  .then(function() {
    res.status(204).end();
  })
  .catch(handleError(res));
}

/**
 * Change a users password
 */
 export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
  .then(user => {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
    } else {
      return res.status(403).end();
    }
  });
}

/**
 * Get my info
 */
 export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
  }

/**
 * Authentication callback
 */
 export function authCallback(req, res, next) {
  res.redirect('/');
}
