import dotenv from 'dotenv'
import { connectDB } from "./db/index.js";
import { app } from './App.js';
import { Server as SocketIOServer } from "socket.io";
import { v4 as uuidV4 } from 'uuid';
import http from 'http';
import { ChessGame } from './models/game.model.js';

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

  socket.on('playername', (playername) => {
    socket.data.playername = playername;
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
                { id: player1.id, playername: player1.data?.playername, color:"white", index:0 },
                { id: player2.id, playername: player2.data?.playername, color:"black", index:1}
            ], 
        };
        
        // Create and save ChessGame document into MongoDB
     const chessGame = await ChessGame.create({
        gameId: roomId,
        players: [player1.data?.playername,player2.data?.playername],
        status: 'pending'
      });
        rooms.set(roomId, roomData);
      
        player1.emit('matchFound', roomData);
        player2.emit('matchFound', roomData);
    }
});

 
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
});
  



