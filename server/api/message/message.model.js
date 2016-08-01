'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
	text :{type:String,required: true},
	sender:{type: Schema.ObjectId,ref: 'User'},
	sendTime:{type:Date,default:Date.now},
	room:{type : mongoose.Schema.ObjectId, ref : 'Room'},
});

export default mongoose.model('Message', MessageSchema);
