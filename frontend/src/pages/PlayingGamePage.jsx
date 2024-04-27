
import  { useState, useEffect, useCallback } from 'react';
import socket from '../socket';
import StartGame from '../components/StartGame';
import Game from '../components/Game';

export default function PlayingGamePage() {
  
  const [room, setRoom] = useState("");
  const [players, setPlayers] = useState([]);


  useEffect(() => {
    socket.on("matchFound", (roomData) => {
      setRoom(roomData.roomId);
      setPlayers(roomData.players);
    });
  
    return () => {
      socket.off("matchFound"); // Clean up event listener
    };
  }, []);

  const cleanup = useCallback(() => {
    setRoom("");
    setPlayers("");

  }, []);

  return (
    <div>
      {room ? (
        
        <Game
          room={room}
          players={players}
          cleanup={cleanup}
        />

      ) : ( 
        <StartGame/>
      )}
    </div>
  );
}
