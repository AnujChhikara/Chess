
import  { useState, useEffect, useCallback } from 'react';
import socket from '../socket';
import StartGame from '../components/StartGame';
import Game from '../components/Game';

export default function PlayingGamePage() {
  
  const [room, setRoom] = useState("");
  const [players, setPlayers] = useState([]);
  const[closeModal, setCloseModal] = useState(false)

  useEffect(() => {
    socket.on("matchFound", (roomData) => {
      setCloseModal(true)
      console.log('macthfound')
      console.log(roomData)
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
          closeModal={closeModal}
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
