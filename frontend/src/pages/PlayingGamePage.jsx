
import  { useState, useEffect, useCallback } from 'react';
import socket from '../socket';
import StartGame from '../components/StartGame';
import Game from '../components/Game';

export default function PlayingGamePage() {
  
  const [room, setRoom] = useState("");
  const [players, setPlayers] = useState([]);
  const[isModalOpen, setIsModalOpen] = useState(false)

  const cleanup = useCallback(() => {
    setRoom("");
    setPlayers([]);
    setIsModalOpen(false)
  }, []);

  useEffect(() => {
    socket.on("matchFound", (roomData) => {
      cleanup()
      setIsModalOpen(true)
      setRoom(roomData.roomId);
      setPlayers(roomData.players);
    });
  
    return () => {
      socket.off("matchFound"); // Clean up event listener
    };
  }, [cleanup]);

 

  return (
    <div>
      {room ? (
        
        <Game
          room={room}
          players={players}
          cleanup={cleanup}
          isModalOpne={isModalOpen}
        />

      ) : ( 
        <StartGame/>
      )}
    </div>
  );
}
