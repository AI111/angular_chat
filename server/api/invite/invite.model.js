'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var InviteSchema = new mongoose.Schema({
	message: String,
	from: {type: Schema.Types.ObjectId,ref: 'User'},
	to: {type: Schema.Types.ObjectId,ref: 'User'},
	created:{type:Date,default:Date.now}
});

export default mongoose.model('Invite', InviteSchema);
