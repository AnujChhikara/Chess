/* eslint-disable no-unused-vars */
import  { useState, useEffect } from 'react';
import socket from '../socket';
import Container from "@mui/material/Container";
import StartGame from './StartGame';
import Game from '../components/Game';

export default function PlayingGamePage() {
  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);
  const[color, setColor]= useState("")
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  useEffect(() => {
    socket.on("matchFound", (roomData) => {
      setRoom(roomData.roomId);
      setPlayers(roomData.players);
      setOrientation(roomData.color)
      setColor(roomData.color);
      
    
    });
  
    return () => {
      socket.off("matchFound"); // Clean up event listener
    };
  }, []);

  return (
    <Container>
      {room ? (
        <Game
          room={room}
          orientation={orientation}
          players={players}
          color={color}
          setUsernameSubmitted={setUsernameSubmitted} // Pass setUsernameSubmitted for cleanup
        />
      ) : (
        <StartGame
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
          setUsernameSubmitted={setUsernameSubmitted} // Pass setUsernameSubmitted for cleanup
        />
      )}
    </Container>
  );
}
