import { useState } from 'react';
import socket from '../socket';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


export default function StartGame() {
  const [searchingMatch, setSearchingMatch] = useState(false)
  const player = useSelector((state) => state.player) 
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  let isAuth = false
  if(player.playerData.length > 0){
    isAuth = true
  }

  const handleJoinQueue = () => {
    setSearchingMatch(true)

    socket.emit('joinQueue');
  };
  const handleButtonClick = () => {
    if (isAuth) {
      handleJoinQueue();
    } else {
      setShowLoginMessage(true);
    }
  };

  return (
    <div className='flex justify-start items-start px-20 pt-20 space-x-12'>
      {/* get user data  */}
     <img className='w-[600px]' src='/chessboard.png' alt='chessboardImage'/>
         
      {
      !showLoginMessage && searchingMatch? <button disabled className='bg-green-500 text-lg animate-pulse  font-bold px-6 py-2 rounded-xl' >
        finding player...
      </button>:
       <>
       {showLoginMessage && (
         <div className='flex flex-col justify-start items-center  px-4 py-2 bg-black rounded-xl w-80 h-60'>
           <h2 className='bg-opacity-80 bg-black px-2 py-2 text-xl font-bold mb-6'>Please login/register to play</h2>
           <Link className='bg-green-400 px-6 py-2 rounded-xl mb-6 hover:bg-green-700 duration-500' to="/login">Login</Link>
           <Link className='bg-green-400 px-6 py-2 rounded-xl hover:bg-green-700 duration-500' to="/register">Register</Link>
         </div>
       )}
       {!showLoginMessage && (<button
         className='bg-green-500 text-lg font-bold px-6 py-2 rounded-xl'
         onClick={handleButtonClick}
       >
         Play Chess
       </button>)}
     </>
      }
    </div>
  );
}
