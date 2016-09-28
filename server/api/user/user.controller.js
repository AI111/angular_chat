'use strict';

import User from "./user.model";
import config from "../../config/environment";
import jwt from "jsonwebtoken";
import Invite from "../invite/invite.model";
import multer from "multer";

const gm = require('gm').subClass({imageMagick: true});
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const debug = require('debug')('user.controller');

const options = {
  root: config.root + '/uploads/',
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({storage: storage}).single('image');

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
    .then(function (user) {
      var token = jwt.sign({_id: user._id}, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({token});
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
export function getContacts(req, res, next) {
  var userId = req.user._id;
  debug('getContacts',userId);
  return User.findById(userId).populate('contacts','_id name email img').exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      debug('getContacts', user);
      res.json(user.contacts);
    })
    .catch(err => next(err));
}
export function getRooms(req, res, next) {
  var userId = req.user._id;
  debug('getRooms',userId);
  return User.findById(userId).populate({
    path:'rooms',
    model:'Room',
    select:'-messages',
    populate:[
      {
        path: 'users',
        select: 'name'
      },
      {
        path: 'creator',
        select: 'name img'
      }
    ]
  }).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      debug('getRooms', user);
      res.json(user.rooms);
    })
    .catch(err => next(err));
}
export function getInvites(req, res, next) {
  var userId = req.user._id;
  debug('getInvites',userId);
  return User.findById(userId,'invites')
    .populate({
      path: 'invites',
      model: 'Invite',
      select: '-to',
      populate: {
        path: 'from',
        select: 'name email img',
      }
    }).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      debug('getInvites', user.invites)
      res.json(user.invites);
    })
    .catch(err => next(err));
}

export function findByEmail(req, res, next) {
  var email = req.params.email;

  return User.find({"email": '/'+email+'/'}).select("_id name email img").exec()
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
  var userId = req.user._id;
  debug('findByName ',name)
  return User.find({"name": new RegExp(name, 'i')}).where({_id: {$ne: userId}}).select("_id name email img").exec()
    .then(users => {
      if (!users) {
        return res.status(404).end();
      }
      res.status(200).json(users);
      debug('findByName response', users);
    })
    .catch(err => next(err));
}
export function findContactByName(req, res, next) {
  var name = req.params.name;
  var userId = req.user._id;
  debug('findContactByName ',name)
  return User.findOne({ _id: userId }, 'contacts').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      return User.find({
        "name": new RegExp(name, 'i'),
        '_id': { $in:user.contacts}
      }).select("_id name email img").exec()
        .then(users => {
          if (!users) {
            return res.status(404).end();
          }
          res.status(200).json(users);
          debug('findByName response', users);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));

}
export function inviteUser(req, res, next) {
  var invitedUser = req.params.user_id;
  var userId = req.user._id;
  var newInvite = new Invite({
    message: 'Add friend',
    from: userId,
    to: invitedUser
  });
  debug('inviteUser', newInvite);
  newInvite.save()
    .then(function(invite) {
      debug('inviteUser save invite ',invite);
      return User.findById(invitedUser).exec()
        .then(user => {
          if (user) {
            debug('inviteUser find user ', user);
            user.invites.push(newInvite);
            return user.save()
              .then(() => {
                debug('inviteUser add invite to user ', user);
                res.status(204).end();
              })
              .catch(validationError(res));
          } else {
            return res.status(404).end();
          }
        }).catch(validationError(res));
      ;
    })
    .catch(validationError(res));

}
/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function () {
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

export function changeImege(req, res, next) {
  debug('changeImege', req.file);
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return res.status(403).end();
    }
    return User.findById(req.user._id).exec()
      .then(user=> {
        if (user.img === config.photo) {
          user.img = req.file.path;
          return Promise.resolve(user);
        } else {
          user.img = req.file.path;
          return fs.unlink(req.file.path).then(()=> {
            return Promise.resolve(user);
          })
            .catch(err=> {
              return Promise.reject(err);
            })
        }
      })
      .then(user=> {
        return user.save()
          .then(user=> {
            return Promise.resolve(user);
          })
      })
      .catch(handleError(res));
  });

}
export function changeAvatar(req, res, next) {
  debug('changeAvatar', req.body);
  debug('changeAvatar', req.file);
}
function exists(path) {
  debug('exists', path);
  return new Promise((resolve, reject)=> {
    fs.exists(path, (data, err)=> {
      debug('exists', data, err);
      if (err) {
        reject(err);
      } else {
        resolve(data)
      }
    });
  });
}
function imgResize(path, query) {

  if (!query.sz || query.sz >= 100 || query.sz < 1) {
    return Promise.resolve(path);
  }
  let resizedPath = path.replace(/(\.w*|$)/, 'sz' + query.sz + '$1');
  return exists(resizedPath).then(exist=> {
    if (exist) {
      return Promise.resolve(resizedPath);
    } else {
      return new Promise((resolve, reject)=> {
        gm(path)
          .resize(query.sz, null, '%')
          .write(resizedPath, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(resizedPath);
            }
          });
      });
    }
  })
}
export function getImg(req, res, next) {
  debug('getImg', req.params.path, req.query);
  let path = config.root + '/uploads/' + req.params.path;
  return exists(path).then((exist)=> {
    if (exist) {
      if (req.query) {
        return imgResize(path, req.query)
          .then(imdUrl=> {
            return res.sendFile(imdUrl)
          });
      } else {
        return res.sendFile(path);
      }
    } else {
      return res.status(404).end();
    }
  }).catch(handleError(res))

}
