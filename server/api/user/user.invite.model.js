'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var InviteSchema = new mongoose.Schema({
  message: String,
  from: {type: Schema.ObjectId,ref: 'User'},
  to: {type: Schema.ObjectId,ref: 'User'},
});

export default mongoose.model('Invite', InviteSchema);