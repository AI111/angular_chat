'use strict';

import mongoose from 'mongoose';
import {MessageSchema} from '../message/message.model';
var Schema = mongoose.Schema;

var RoomSchema = new mongoose.Schema({
 	name :{type:String,required: true},
    created: {type: Date, default:Date.now},
    messages:[MessageSchema],
    users:[{type : mongoose.Schema.ObjectId, ref : 'User'}],
    creator:{type : mongoose.Schema.ObjectId, ref : 'User'}
});

export default mongoose.model('Room', RoomSchema);

