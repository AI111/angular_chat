'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
	text :{type:String,required: true},
	sender:{type: Schema.ObjectId,ref: 'User'},
	sendTime:{type:Date,default:Date.now},
	
});

export default mongoose.model('Message', MessageSchema);
exports.MessageSchema = MessageSchema;