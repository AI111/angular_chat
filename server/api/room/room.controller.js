/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/rooms              ->  index
 * POST    /api/rooms              ->  create
 * GET     /api/rooms/:id          ->  show
 * PUT     /api/rooms/:id          ->  update
 * DELETE  /api/rooms/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Room from './room.model';
import User from '../user/user.model'
var debug = require('debug')('room.controller');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleAccessForbidden(req,res) {
  var userId=req.user._id;
  debug('handleAccessForbidden userId ',userId);
  return function(entity) {
    debug('handleAccessForbidden users typeof',entity.users[0]._id,' users ',entity.users[0]);
    if(entity.users[0]._id){
      if(!entity.users.find(user=>{return user._id.toString()==userId})){
        debug('handleAccessForbidden not allow ');
        res.status(403).end();
        return null;
      }
    }else{
      if (entity.users.indexOf(userId)==-1) {
        debug('handleAccessForbidden users Array',entity);
        res.status(403).end();
        return null;
      }
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
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

// Gets a list of Rooms
export function index(req, res) {
  return Room.find({}).select('-messages').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Room from the DB
export function show(req, res) {
  return Room.findById(req.params.id).exec()
    .then(handleAccessForbidden(req,res))
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
export function getUsers(req, res) {
  debug('getUsers',req.params.id);
  return Room.findById(req.params.id,'users').populate('users','_id name img').exec()
    .then(handleAccessForbidden(req,res))
    .then(handleEntityNotFound(res))
    .then( (room)=>{
      debug('getUsers room',room);
      if (room) {
        res.status(200).json(room.users);
      }
    })
    .catch(handleError(res));
}
export function getMessages(req, res) {
  debug('getMessages',req.params.id);
  return Room.findById(req.params.id).exec()
    .then(handleAccessForbidden(req,res))
    .then(handleEntityNotFound(res))
    .then( (room)=>{
      // debug('getMessages room',room);
      if (room) {
        res.status(200).json(room.messages);
      }

    })
    .catch(handleError(res));
}

// Creates a new Room in the DB
export function create(req, res) {
  var room = req.body;
  room.creator=req.user._id;

  if (room.users) {
    room.users.push(req.user._id)
  }else{
    room.users=[req.user._id]
  }
  debug('create room',room, ' user: ',req.user._id);


  return Room.create(room)
    .then(room=>{
      User.update({'_id':{$in:room.users}},{$push: {rooms: room._id}}, {multi: true}, (err, result)=>{

        if (!err) {
          debug('save updates',result);
          Room.populate(room,{path: 'users', model: 'User',select:'name' }, (err, new_room)=>{
            if(err) return res.status(500).send(err);
            res.status(201).json(new_room);
          });
        }else{return res.status(500).send(err)}

      } )

      // User.find({'_id':{$in:room.users}}).exec()
      //   .then(users=>{
      //     users.forEach(user=>user.rooms.push(room));
      //     users.save().then(u=>{
      //       debug('save updates',u);
      //       room.populate('users').exec()
      //         .then(r=>res.status(201).json(r))
      //
      //
      //     })
      //   }).catch(err=>{
      //
      // });
    })
    // .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Room in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Room.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Room from the DB
export function destroy(req, res) {
  return Room.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
