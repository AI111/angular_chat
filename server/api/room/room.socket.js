/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import RoomEvents from './room.events';
import Room from './room.model';
import Message from '../message/message.model';
var debug = require('debug')('room.socket');
// Model events to emit
var events = ['save', 'remove'];
export function register(socket,rooms) {
  // Bind model events to socket events
  var current_room;
  socket.on('connect to room',(room_id,clb)=>{
    debug('connect to room ',room_id,socket.decoded_token);
    debug('connect to room rooms',rooms);

    Room.findById(room_id).exec()
      .then(handleAccessForbidden(socket))
      .then(handleEntityNotFound(socket))
      .then(room=>{
        socket.join(room_id);
        current_room=room_id;
        if(!rooms.has(room_id))rooms.set(room_id,{
          online_users:new Array(),
          online_users_map:new Map()
        });
        var room = rooms.get(room_id);
        debug('connect clients to room',room_id,room);
        clb(room);

        room.online_users.push({socket_id:socket.id,room_id:socket.decoded_token._id});
        room.online_users_map.set(socket.decoded_token._id,socket.id);
        socket.broadcast.to(room_id).emit('user connect',socket.decoded_token._id);
        // debug('connected clients',socket.clients(room_id));
      })
      .catch(handleError(socket));
  });
  socket.on('disconnect',()=>{
    debug('disconect',socket.id);

    if(rooms.has(current_room)){
      rooms.get(current_room).online_users.splice(socket.id,1);}
  });
  socket.on('broadcast msg',(msg,clb)=>{
    if(current_room)
      Room.findById(current_room).exec().then(room=>{
        room.messages.push(new Message({text:msg,sender:socket.decoded_token._id}));
        room.save().then(updated=>{
          let message = updated.messages[updated.messages.length-1];
          clb('msg saved',message);
          debug('broadcast msg',message);
          socket.broadcast.to(current_room).emit('add msg',message);
        })
      }).catch(err=>{
        debug('add msg err',err);
        socket.emmit('room error',err);
      });
  });
}
function handleError(socket, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    socket.emit('room error',err);
    debug('handleError',err);
  };
}

function handleEntityNotFound(socket) {
  return function(entity) {
    if (!entity) {
      //res.status(404).end();
      throw new InvalidItemsError();
      return null;
    }
    return entity;
  };
}
function handleAccessForbidden(socket) {
  var userId=socket.decoded_token._id;
  debug('handleAccessForbidden userId ',userId);
  return function(entity) {
    debug('handleAccessForbidden users typeof',entity.users[0]._id,' users ',entity.users[0]);

    if (entity.users.indexOf(userId)==-1) {
      debug('handleAccessForbidden users Array',entity);
      throw new InvalidItemsError();
    }

    return entity;
  };
}
function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    RoomEvents.removeListener(event, listener);
  };
}
