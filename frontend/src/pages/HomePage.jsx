import { useState } from "react";
import socket from "../socket";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [username, setUsername] = useState(""); 
  const navigate = useNavigate();

  const handleClick = () => {
  
      if (!username) return;
      socket.emit("username", username);
      navigate('/liveGame');
  }
  
  return (
    <div className="flex flex-col w-screen h-screen justify-around items-center">
      <img src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hlc3N8ZW58MHx8MHx8fDA%3D"
      className="w-96" alt="" />
      <div className="flex flex-col space-y-2 items-center">
        <input type="text"  onChange={(e) => setUsername(e.target.value)} placeholder="enter your name" className="w-60 px-4 py-2 bg-transparent border rounded-2xl" />
        <button onClick={handleClick}>Continue</button>
      </div>
    </div>
  )
}
