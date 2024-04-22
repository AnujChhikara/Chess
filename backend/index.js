const express = require('express');
const { Server } = require("socket.io");
const { v4: uuidV4 } = require('uuid');
const http = require('http');

const app = express(); // initialize express

const server = http.createServer(app);
const port = process.env.PORT || 8080 


const io = new Server(server, {
  cors: '*', 
});

const rooms = new Map();
const waitingPlayers = [];

// socket.io connection
io.on('connection', (socket) => {

  console.log(socket.id, 'connected');

  socket.on('username', (username) => {
    console.log('username:', username);
    socket.data.username = username;
  });

  socket.on('joinQueue', () => {

    waitingPlayers.push(socket);

    if (waitingPlayers.length >= 2) {

        const player1 = waitingPlayers.shift();
        const player2 = waitingPlayers.shift();


        const roomId = uuidV4();
        player1.join(roomId);
        player2.join(roomId);

   
        const roomData = {
            roomId,
            players: [
                { id: player1.id, username: player1.data?.username },
                { id: player2.id, username: player2.data?.username}
            ], 
            color:[
              'white', 
              'black'  
            ]
        };

      
        rooms.set(roomId, roomData);

      
        player1.emit('matchFound', roomData);
        player2.emit('matchFound', roomData);
    }
});

 
    socket.on('move', (data) => {
    socket.to(data.room).emit('move', data.move);
  });

  
});


server.listen(port, () => {
  console.log(`listening on *:${port}`);
});