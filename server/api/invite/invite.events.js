/**
 * Invite model events
 */

'use strict';

import {EventEmitter} from 'events';
import Invite from './invite.model';
var InviteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
InviteEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Invite.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    InviteEvents.emit(event + ':' + doc._id, doc);
    InviteEvents.emit(event, doc);
  };
}

export default InviteEvents;
