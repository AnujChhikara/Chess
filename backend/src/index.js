import dotenv from 'dotenv'
import { connectDB } from "./db/index.js";
import { app } from './App.js';
import { Server as SocketIOServer } from "socket.io";
import { v4 as uuidV4 } from 'uuid';
import http from 'http';
import { ChessGame } from './models/game.model.js';
import { Player } from './models/player.model.js';

dotenv.config({
  path: './.env'
})

const port = process.env.PORT || 8080

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

connectDB()
.then(
    server.listen(port, () => {
        console.log(`Server is running at ${port}`);
    })
)
.catch((err) => {
    console.log("MONGO db connection failed", err);
})

// const redisClient = createClient({
//   host: process.env.REDDIS_HOST,
//   port: 17060, 
//   password: process.env.REDDIS_PASSWORD
// });


const rooms = new Map();
const waitingPlayers = [];


// socket.io connection
io.on('connection', (socket) => {

  console.log(socket.id, 'connected');

  socket.on('playerData', (playerData) => {
    socket.data.playerData = playerData;   
    
  });

  socket.on('joinQueue', async () => {
   
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
                { id: player1.id, playername: player1.data?.playerData.playername,dbId:player1.data?.playerData._id, color:"white", index:0, rating:player1.data?.playerData.rating },
                { id: player2.id, playername: player2.data?.playerData.playername,dbId:player2.data?.playerData._id, color:"black", index:1, rating:player2.data?.playerData.rating}
            ], 
        };
         //making sure player dont match himself
        if(roomData.players[0].dbId === roomData.players[1].dbId ){
          return
        }
         
                // Create and save ChessGame document into MongoDB
     await ChessGame.create({
      gameId: roomId,
      players: [player1.data?.playerData.playername,player2.data?.playerData.playername],
      status: 'pending'
    });
      rooms.set(roomId, roomData);
      player1.emit('matchFound', roomData);
      player2.emit('matchFound', roomData);
  }
       
     
});


 //handle player moves
socket.on('move', async (data) => {
  // Emit move event to other clients
  socket.to(data.room).emit('move', data.move);

  // Save move data into MongoDB
  await ChessGame.findOneAndUpdate(
    { gameId: data.room },
    { $push: { moves: data.move } },
    { new: true }
  );
});

 // Handling disconnection
 socket.on("disconnect", () => {
  const gameRooms = Array.from(rooms.values()); // <- 1

  //finding disconnected player in any room
  gameRooms.forEach(async (currentRoom) => { // <- 2 (renamed to currentRoom)
    const userInRoom = currentRoom.players.find((player) => player.id === socket.id); 
    if (userInRoom) {
      if (currentRoom.players.length < 2) {
        // if there's only 1 player in the room, close it and exit.
        rooms.delete(currentRoom.roomId);
        return;
      }

      const looser = userInRoom;
      const winner = currentRoom.players[userInRoom.index === 0 ? 1 : 0];

      await Player.findByIdAndUpdate(looser.dbId, 
        { $inc: { rating: -10 } },
        { new: true } 
      );

      await Player.findByIdAndUpdate(winner.dbId, 
        { $inc: { rating: +10 } },
        { new: true } 
      );
        await ChessGame.findOneAndUpdate({ gameId: currentRoom.roomId }, {
        status: 'finished',
        winner:winner.playername
      }, {
        new: true
      });


      socket.to(currentRoom.roomId).emit("playerDisconnected", userInRoom); // <- 4
    }
  });

});

  //handle resignation
  socket.on('resignation', async (playerData) => {
    const gameRooms = Array.from(rooms.values());
  
    gameRooms.forEach(async (room) => {
      const resignBy = room.players.find((player) => player.id === playerData.id);
  
      if (resignBy) {
       
          if (room.players.length < 2) {
            // if there's only 1 player in the room, close it and exit.
            rooms.delete(room.roomId);
            return;
          }
        const winner = room.players.find((player) => player.id !== playerData.id);
        await Player.findByIdAndUpdate(
          socket.data.playerData._id,
          { $inc: { rating: -10 } },
          { new: true }
        );
        await Player.findByIdAndUpdate(
          winner.dbId,
          { $inc: { rating: +10 } },
          { new: true }
        );

        const updatedRoom = await ChessGame.findOneAndUpdate({ gameId: room.roomId }, {
          status: 'finished', 
          winner: winner.playername
          
        }, {
          new: true
        });
  

  
        if (!updatedRoom) {
          console.log('Cannot find room');
        }
         socket.to(room.roomId).emit("resignation", resignBy);
      }
    });
  });
  
  //handle offer draw

  //offering draw

  socket.on('drawOffer', (playerData) => {
    const gameRooms = Array.from(rooms.values());
  
    gameRooms.forEach(async (room) => {
      const drawOfferBy = room.players.find((player) => player.id === playerData.id);
  
      if (drawOfferBy) {
         socket.to(room.roomId).emit("drawOffer");
      }
    });
  });

  //handle draw response
  socket.on('drawResponse', (data) => {

    const gameRooms = Array.from(rooms.values());
  
    gameRooms.forEach(async (room) => {
      const drawResponse = room.players.find((player) => player.id === data.playerData.id);
  
      if (data.response) {
        const updatedRoom = await ChessGame.findOneAndUpdate({ gameId: room.roomId }, {
          status: 'finished', winner:'draw'
        }, {
          new: true
        });
         socket.to(room.roomId).emit("drawResponse", true);
      } 
      else{
        socket.to(room.roomId).emit("drawResponse", false);
      }
    });

      })
   
//handle rematch

//reamtch offer

//offering rematch
  socket.on('rematch', (playerData) => {
   const gameRooms = Array.from(rooms.values());
  
   gameRooms.forEach(async (room) => {
     const reamtchOfferBy = room.players.find((player) => player.id === playerData.id);
 
     if (reamtchOfferBy) {
        socket.to(room.roomId).emit("rematch");
     }
   });

  });

  //handle rematch response 
// Handle rematch response
socket.on('rematchResponse', (data) => {
  console.log('tiggegr rematch')
  const gameRooms = Array.from(rooms.values());
  
  gameRooms.forEach(async (room) => {
    const player = room.players.find((player) => player.id === data.playerData.id);
    if (!player) {
      console.log('tiggegr rematch2')
        return; // Player not found in the room, handle error
    }
    if (data.response) {
      console.log('tiggegr rematch3')
      console.log(room)
        // Player accepted the rematch, proceed with rematch logic
        const player1 = room.players[0].id
        const player2 = room.players[1].id
  
        if (!player1 || !player2) {
          console.log('tiggegr rematch4')
            return; // Handle error, socket instances not found
        }
  
        // Your rematch logic here...
        // For example:
        const roomId = uuidV4();
        player1.join(roomId);
        player2.join(roomId);
  
        const roomData = {
            roomId,
            players: room.players, // Keep the same players
            status: 'pending' // Reset the status for rematch
        };
  
        rooms.set(roomId, roomData); // Update room data
        console.log('tiggegr rematch5')
        // Emit 'matchFound' event to both players
        player1.emit('matchFound', roomData);
        player2.emit('matchFound', roomData);
    } else {
        // Player declined the rematch, handle accordingly
        // For example:
        console.log('Player declined the rematch');
    }
  
  })
  
  
  
});
});
  


