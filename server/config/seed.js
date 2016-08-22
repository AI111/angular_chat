/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

 'use strict';
 import Thing from '../api/thing/thing.model';
 import User from '../api/user/user.model';
 import Invite from '../api/user/user.invite.model';
 import Room from '../api/room/room.model'
 import {Schema} from 'mongoose';
 import Message from '../api/message/message.model';
 var debug = require('debug')('seed');

 Thing.find({}).remove()
 .then(() => {
  Thing.create({
    name: 'Development Tools',
    info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
    'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
    'Stylus, Sass, and Less.'
  }, {
    name: 'Server and Client integration',
    info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
    'AngularJS, and Node.'
  }, {
    name: 'Smart Build System',
    info: 'Build system ignores `spec` files, allowing you to keep ' +
    'tests alongside code. Automatic injection of scripts and ' +
    'styles into your index.html'
  }, {
    name: 'Modular Structure',
    info: 'Best practice client and server structures allow for more ' +
    'code reusability and maximum scalability'
  }, {
    name: 'Optimized Build',
    info: 'Build process packs up your templates as a single JavaScript ' +
    'payload, minifies your scripts/css/images, and rewrites asset ' +
    'names for caching.'
  }, {
    name: 'Deployment Ready',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
    'and openshift subgenerators'
  });
});


 User.find({}).remove()
 .then(() => {
  User.create([
  {
    provider: 'local',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    name: 'A test User 2',
    email: 'test2@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    name: 'TEST User 3',
    email: 'test3@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    name: 'Test User 4',
    email: 'test4@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    name: 'Tes User 5',
    email: 'test5@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    name: 'est User 6',
    email: 'test6@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    name: 'User 7',
    email: 'test7@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 8',
    email: 'test9@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 9',
    email: 'test9@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 10',
    email: 'test10@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 11',
    email: 'test7@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 12',
    email: 'test7@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 13',
    email: 'test7@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 14',
    email: 'test7@example.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'User 15',
    email: 'test7@example.com',
    password: 'test'
  },
  {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin'
  }]
  )
  .then((data) => {
        //console.log('data',data);
        debug('finished populating user');

        createRooms(data).then(()=>{
          createInvits(data).then(()=>{

          });
        });
      });
});
 var createInvits= function (users) {
  return Invite.find({}).remove()
  .then(()=>{
    return Invite.create([
    {
      message:'mess 1',
      from:users[1],
      to:users[0]
    },
    {
      message:'mess 2',
      from:users[1],
      to:users[0]
    },
    {
      message:'mess 3',
      from:users[2],
      to:users[0]
    },
    {
      message:'mess 4',
      from:users[3],
      to:users[0]
    },
    {
      message:'mess 5',
      from:users[4],
      to:users[0]
    },
    {
      message:'mess 6',
      from:users[5],
      to:users[0]
    }
    ]).then((data)=>{

      data.forEach(val=>users[0].invites.push(val));
      for(var i=1;i<users.length;i++)users[0].contacts.push(users[i]);
       users[0].save().then(()=>debug('finished populating user Invites'));
        users[1].save().then(()=>debug('finished populating user Invites'));
     debug('Rooms ' ,users[0].rooms);
   })
  });

}
var createRooms = function(users){
  var roomsData=[
    {
      name:'users test room 1',
      creator:users[0],
      users:users.slice(0,-1)
    },
    {
      name:'users test room 2',
      creator:users[0],
      users:users.slice(0,5)
    },
    {
      name:'users test room 3',
      creator:users[0],
      users:users.slice(0,2)
    },
    {
      name:'users test room 4',
      creator:users[0],
      users:users.slice(0,3)
    },
    {
      name:'users test room 5',
      creator:users[0],
      users:users.slice(1,5)
    }
  ];
  //roomsData[2].messages=generateMessages(roomsData[2],5);
  roomsData.forEach(room=>{room.messages=generateMessages(room,20)});
  return Room.find({}).remove().then(()=>{
   return Room.create(roomsData).then((data)=>{
      data.forEach(room=>{
        users.forEach(u=>u.rooms.push(room));
      });
      debug('Rooms ' ,users[0].rooms);
          // return new Promise((resolve, reject)=>{
          //   users[0].save().then(()=>debug('finished populating user Rooms'));
          // })
          // createMessages(data);
        })
  });
}
var generateMessages=function(room,size){
  debug('createMessages',room.name);
  // return Message.find({}).remove()
  // .then(()=>{
    var messagesLenght=size||100;
    var messagees = [];
    for(var i = 0;i<messagesLenght;i++){
      messagees.push( new Message({
        text:"message # "+i,
        sender:room.users[Math.floor(Math.random() * room.users.length)],
      }));
    };
    return messagees;
  //   return Message.create(messagees).then((messagees)=>{
  //     debug('Messages ' ,messagees.length);
  //   });
  // });
}
