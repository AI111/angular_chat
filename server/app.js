/**
 * Main application file
 */

'use strict';

import express from "express";
import mongoose from "mongoose";
import config from "./config/environment";
import https from "http";
mongoose.Promise = require('bluebird');

// var options = {
//    key  : fs.readFileSync(__dirname+'/config/keys/server.key'),
//    cert : fs.readFileSync(__dirname+'/config/keys/server.crt')
// };


var debug = require('debug')('app')
// Connect to MongoDB
console.log('mongose',config.mongo.uri, config.mongo.options);

mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) {console.log('Populate databases'); require('./config/seed');}

// Setup server
var app = express();
var server = https.createServer(app);

var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    debug('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
