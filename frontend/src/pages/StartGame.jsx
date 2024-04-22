/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import  { useState } from "react";
import { Button } from "@mui/material";
import socket from '../socket';

export default function StartGame({ setRoom, setOrientation, setPlayers, setUsernameSubmitted }) {
  const [roomInput, setRoomInput] = useState('');
  const [roomError, setRoomError] = useState('');

  const handleJoinQueue = () => {
    socket.emit('joinQueue');
    setUsernameSubmitted(true); // Set username submitted to true
  };



  return (
    <div
    >
      <Button variant="contained" onClick={handleJoinQueue}>
        Play Chess
      </Button>

      {roomError && <p>{roomError}</p>}
    </div>
  );
}
