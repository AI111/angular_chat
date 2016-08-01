'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var RoomSchema = new mongoose.Schema({
 	name :{type:String,required: true},
    created: {type: Date, default:Date.now},
    users:[{type : mongoose.Schema.ObjectId, ref : 'User'}],
    creator:{type : mongoose.Schema.ObjectId, ref : 'User'}
});

export default mongoose.model('Room', RoomSchema);
