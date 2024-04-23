import { useState } from 'react';
import socket from '../socket';


export default function StartGame() {
  const [searchingMatch, setSearchingMatch] = useState(false)

  const handleJoinQueue = () => {
    setSearchingMatch(true)

    socket.emit('joinQueue');
  };

  return (
    <div className='flex justify-start items-start px-20 pt-20 space-x-12'>
      {/* get user data  */}
      <img className='w-[600px]' src='/chessboard.png' alt='chessboardImage'/>
         
      {
        searchingMatch? <button disabled className='bg-green-500 text-lg animate-pulse  font-bold px-6 py-2 rounded-xl'  onClick={handleJoinQueue}>
        finding player...
      </button>:
      <button className='bg-green-500 text-lg font-bold px-6 py-2 rounded-xl'  onClick={handleJoinQueue}>
      Play Chess
    </button>
      }
    </div>
  );
}
