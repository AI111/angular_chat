/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import MessageEvents from './message.events';
var debug = require('debug')('message.socket');
// Model events to emit\

var events = ['save', 'remove'];

export function register(socket) {

  //socket.on('connection',so)
  // Bind model events to socket events
  // for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
  //   var event = events[i];
  //   var listener = createListener('message:' + event, socket);
  //
  //   MessageEvents.on(event, listener);
  //   socket.on('disconnect', removeListener(event, listener));
  // }
}


function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    MessageEvents.removeListener(event, listener);
  };
}
