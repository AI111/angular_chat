var debug = require('debug')('conf.socket');

export function register(socket,roomsMap) {
	 var currentRoom, id;

        socket.on('init', function (data, fn) {
          debug('init',data);
          currentRoom = data.room;
          debug('init rooms',roomsMap);
          if(!roomsMap.has(currentRoom))roomsMap.set(currentRoom,{
          //pair - value of user _id and number of this user connections	
          online_users:new Map(),
          //save count of sockets
          userSocketsId:0,
          //save sockets
          userSockets:new Array()
        });
          var room = roomsMap.get(currentRoom);
          debug('room',room);
          if (data)  {
            if (!room) {
              return;
            }
            socket.join(currentRoom);
            room.userSocketsId += 1;
            id = room.userSocketsId;
            fn(currentRoom, id);
            socket.broadcast.to(currentRoom).emit('peer.connected', { id: id });
            room.userSockets[id] = socket;
            debug('Peer connected to room', currentRoom, 'with #', id);
          }
        });

        socket.on('msg', function (data) {
          debug('msg',data);
          var room = roomsMap.get(currentRoom);
          var to = parseInt(data.to, 10);
          if (room && room.userSockets[to]) {
            debug('Redirecting message to', to, 'by', data.by);
            room.userSockets[to].emit('msg', data);
          } else {
            console.warn('Invalid user');
          }
        });

        socket.on('disconnect', function () {

          if (!currentRoom || !roomsMap.has(currentRoom)) {
            return;
          }
          var room = roomsMap.get(currentRoom)
          delete room.userSockets[room.userSockets.indexOf(socket)];
          room.userSockets.forEach(function (socket) {
            if (socket) {
              socket.emit('peer.disconnected', { id: id });
            }
          });
        });
}