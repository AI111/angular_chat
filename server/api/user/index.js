'use strict';

import {Router} from "express";
import * as controller from "./user.controller";
import * as auth from "../../auth/auth.service";

var router = new Router();


router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/name/:name',auth.isAuthenticated(), controller.findByName);
router.get('/me/contacts',auth.isAuthenticated(), controller.getContacts);
router.get('/me/contacts/:name',auth.isAuthenticated(), controller.findContactByName);
router.get('/me/photo/:path', controller.getImg);

router.get('/me/invites',auth.isAuthenticated(), controller.getInvites);
router.get('/me/rooms',auth.isAuthenticated(), controller.getRooms);


router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/photo', auth.isAuthenticated(), controller.changeImege);
router.post('/avatar', controller.changeAvatar);

router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
