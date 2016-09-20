/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/invites              ->  index
 * POST    /api/invites              ->  create
 * GET     /api/invites/:id          ->  show
 * PUT     /api/invites/:id          ->  upsert
 * PATCH   /api/invites/:id          ->  patch
 * DELETE  /api/invites/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Invite from './invite.model';
import User from '../user/user.model'
let debug = require('debug')('invite.controller');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Invites
export function index(req, res) {
  return Invite.find({to:req.user._id}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Invite from the DB
export function show(req, res) {
  return Invite.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Invite in the DB
export function create(req, res) {
  req.body.from=req.user._id;
  debug('create invite',req.body);
  return Invite.create(req.body)
    .then(invite=>{
      return User.findById(req.body.to).exec()
        .then(user=>{
          user.invites.push(invite._id);
          return user.save().then(u=>{
            return Promise.resolve(invite);
          })
        }).catch(err=>{return Promise.reject(err);})
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}
export function accept(req,res) {
  debug('accept',req.params.id);
  return Invite.findById(req.params.id).exec()
    .then(invite=>{
      return User.findById(req.user._id).exec()
        .then(user=>{
          if(user.contacts.indexOf(invite.from)==-1)user.contacts.push(invite.from);
          return user.save()
            .then(()=>{
              return Promise.resolve(invite);
            })
        }).catch(err=>{
          Promise.reject(err)
        })
    }).then(removeEntity(res))
    .catch(handleError(res))
}

// Upserts the given Invite in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Invite.findOneAndUpdate(req.params.id, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Invite in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Invite.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Invite from the DB
export function destroy(req, res) {
  return Invite.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(invite=>{
      return User.findById(invite.to).exec().then(user=>{
        user.invites.remove(invite._id)
        return user.save().then(()=>{
          return Promise.resolve(invite);
        })
      }).catch(err=>{
        return Promise.reject(err);
      })
    })
    .then(removeEntity(res))
    .catch(handleError(res));
}
