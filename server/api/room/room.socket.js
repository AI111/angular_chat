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
function mapToArr(myMap) {
  let ans =[];
  for (var [key, value] of myMap.entries()) {
    ans.push({key,value});
  }
  debug('mapToArr',myMap,ans);
  return ans;
// О
}
export function register(socket,rooms) {
  // Bind model events to socket events
  var current_room;
  socket.on('connect to room',(room_id,clb)=>{
    debug('connect to room ',room_id,socket.decoded_token);
    debug('connect to room rooms',rooms);

    Room.findById(room_id).exec()
      .then(handleAccess(socket))
      .then(handleEntityNotFound(socket))
      .then(_room=>{
        socket.join(room_id);
        current_room=room_id;

        //initialize chat room in map
        if(!rooms.has(room_id))rooms.set(room_id,{
          online_users:new Map(),
          //save count of sockets
          userSocketsId:0,
          //save sockets
          userSockets:new Array()
        });
        var room = rooms.get(room_id);

        debug('connect clients to room',room_id,room);

        //initialize user counter of sockets in room
        if(!room.online_users.has(socket.decoded_token._id)){
          room.online_users.set(socket.decoded_token._id,1);
        }else{
          room.online_users.set(socket.decoded_token._id,room.online_users.get(socket.decoded_token._id)+1);
        }

        clb(mapToArr(room.online_users));

        debug('connected to room',room);
        socket.broadcast.to(room_id).emit('user connect',socket.decoded_token._id);
        // debug('connected clients',socket.clients(room_id));
      })
      .catch(handleError(socket));
  });
  socket.on('disconnect',()=>{
    debug('disconect',socket.id);


    if(rooms.has(current_room)){
      let room = rooms.get(current_room);
      room.online_users.set(socket.decoded_token._id,room.online_users.get(socket.decoded_token._id)-1);
      if (room.online_users.get(socket.decoded_token._id)===0){
        room.online_users.delete(socket.decoded_token._id);
        socket.broadcast.to(current_room).emit('user disconnect',socket.decoded_token._id);
      }
    }
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
function handleAccess(socket) {
  debug('handleAccess',socket.decoded_token);
  var userId=socket.decoded_token._id;
  debug('handleAccess userId ',userId);
  return function(entity) {
    debug('handleAccess users typeof',entity.users[0]._id,' users ',entity.users[0]);

    if (entity.users.indexOf(userId)==-1) {
      debug('handleAccess users Array',entity);
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
