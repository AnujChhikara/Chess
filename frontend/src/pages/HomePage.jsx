import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import socket from "../socket";

export default function HomePage() {
  const player = useSelector((state) => state.player) 
  const navigate = useNavigate(); 
  let isAuth = false

  if(player.playerData.length > 0){
    isAuth = true
  } 

  const handleClick = () => {
    socket.emit("playerData", player.playerData[0]);
    navigate('/liveGame');
  }

return (
  <div>
      {!isAuth && (
    <div className="bg-black h-screen flex flex-col justify-center items-center text-white font-sans">
      <h1 className="text-5xl font-bold mb-4">Welcome to ChessLab</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        Enhance your chess skills and challenge opponents worldwide with ChessLab.
      </p>
      <div className="mb-8">
       
        <ul className="list-disc pl-6">
          <li>Play chess games in real-time</li>
          <li>Improve your strategies</li>
          <li>Learn chess tactics</li>
          <li>Challenge opponents of various skill levels</li>
        </ul>
      </div>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition duration-300"
        >
          Register
        </Link>
      </div>
      <div className="text-sm mt-6">
        <p className="mb-1">Not sure where to start?</p>
        <p>
          Check out our{" "}
          <Link to="/guide" className="text-blue-400 underline hover:text-blue-300">
            beginner&lsquo;s guide
          </Link>{" "}
          to get started.
        </p>
      </div>
    </div>
  )
}{
  isAuth && 
  <div className="bg-black">
    <div className="text-end pt-6 pr-6">
      <span className="bg-zinc-800 px-4 py-2 text-lg rounded-md font-bold cursor-pointer">{player.playerData[0].playername}</span>
  </div>
      
  <div className=" text-white min-h-screen flex flex-col justify-start pt-20 items-center">
  <h1 className="text-4xl font-bold mb-8">Welcome to Chess Online</h1>
  <p className="text-lg text-gray-300 mb-12 max-w-xl text-center">Play chess online with players from around the world!</p>
  
    <div className=" flex space-x-12">
      <img src="/chessboard.png" alt="Chess Board" className="w-80 rounded-lg shadow-lg" />
      
      <div>
      <h2 className="text-xl font-bold mb-2">Chess Can Help You:</h2>
      <ul className="text-lg list-disc ml-6">
            <li>Improves concentration</li>
            <li>Boosts problem-solving skills</li>
            <li>Enhances memory retention</li>
            <li>Increases patience</li>
            <li>Builds resilience</li>
            <li>Leads to world domination☠️</li>
            <li>Makes you feel like a strategic genius</li>
            <li>Teaches you how to deal with unexpected situations is life like depression</li>
            
          </ul>
      </div>
     
    </div>
    <div className="px-4 mt-12">
      <p className="text-sm">Join thousands of players in intense chess matches. Whether you&apos;re a beginner or a grandmaster, there&apos;s always someone ready to challenge you!</p>
      <p className="text-sm">Enhance your skills with our comprehensive tutorials and strategy guides. Learn from the best and dominate the chessboard!</p>
      <p className="text-sm">Connect with fellow chess enthusiasts in our vibrant community forums. Discuss strategies, share tips, and make new friends!</p>
    </div>
 
  <button onClick={handleClick} className="bg-blue-500 mt-8 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
    Play Online
  </button>
</div></div>
}

  </div>
)}

