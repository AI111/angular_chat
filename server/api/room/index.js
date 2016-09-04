'use strict';

var express = require('express');
var controller = require('./room.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/',auth.isAuthenticated(), controller.index);
router.get('/:id',auth.isAuthenticated(), controller.show);
router.get('/:id/messages',auth.isAuthenticated(), controller.getMessages);
router.get('/:id/users',auth.isAuthenticated(), controller.getUsers);
router.post('/',auth.isAuthenticated(), controller.create);
router.post('/:id/messages',auth.isAuthenticated(), controller.addMessage);

router.put('/:id',auth.isAuthenticated(), controller.update);
router.patch('/:id',auth.isAuthenticated(), controller.update);
router.delete('/:id',auth.isAuthenticated(), controller.destroy);
router.delete('/:id/users/me',auth.isAuthenticated(), controller.leave);


module.exports = router;
