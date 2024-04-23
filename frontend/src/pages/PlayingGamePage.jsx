/* eslint-disable no-unused-vars */
import  { useState, useEffect } from 'react';
import socket from '../socket';
import StartGame from '../components/StartGame';
import Game from '../components/Game';
import { redirect } from 'react-router-dom';

export default function PlayingGamePage() {
  const username = localStorage.getItem('username')
  if(!username){
    redirect('/')
  }
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

  return (
    <div>
      {room ? (
        
        <Game
          room={room}
          players={players}
        />

      ) : ( 
        <StartGame/>
      )}
    </div>
  );
}
