/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */


import { useState } from 'react';
import Modal from 'react-awesome-modal';
import socket from '../socket'

export default function ResultModal({gameStatus, result, roomId, playerData}) {

    const [searchingMatch, setSearchingMatch] = useState(false) 
    let winner = result.winner
    
   
      const handleButtonClick = () => {
        setSearchingMatch(true)
        socket.emit('rematchRequest',roomId );
      };
   let response = ''
    if(result.status === 'disconnect'){
      response = `${result.winner === 'white' ? 'Black' : 'white'} player got disconnected!`
    } else if (result.status === 'checkmate'){
      response= `Checkmate! ${result.winner} Won the game!`
    } else{
      response = 'Draw!'
    }

      
  return (
    <Modal className="bg-zinc-800"
     visible={gameStatus}
        width="400"
        height="300"
        effect="fadeInUp"
       onClickAway={() => this.closeModal()}
        >
            <div className='w-full h-full  space-y-4 flex-flex-col justify-center items-center bg-gray-600 text-white'>
     <p className="text-xl pt-4 font-bold font-mono text-center">{response}</p>
     <div className='flex justify-around items-center'>
     <div className={`${result.status === 'draw'? '' :winner==='white'? 'border-4 p-2 border-green-500' : ''}`} >
       <svg fill="#ffffff" className="w-20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.189,18.757a1,1,0,0,0-.97-.757h-.933c-1.644-1.726-2.235-4.918-2.449-7H9.163c-.214,2.082-.8,5.274-2.449,7H5.781a1,1,0,0,0-.97.757L4,22H20Z"/><path d="M8,9h8a1,1,0,0,0,0-2h-.635a3.523,3.523,0,0,0,.278-1.357,3.643,3.643,0,0,0-7.286,0A3.523,3.523,0,0,0,8.635,7H8A1,1,0,0,0,8,9Z"/></svg>            
     </div>
     <p className=' text-2xl'>---</p>
     <div className={`${result.status === 'draw'? '' :winner==='white'? '' : 'border-4 p-2 border-green-500'}`}>
        <svg fill="#000000" className="w-20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.189,18.757a1,1,0,0,0-.97-.757h-.933c-1.644-1.726-2.235-4.918-2.449-7H9.163c-.214,2.082-.8,5.274-2.449,7H5.781a1,1,0,0,0-.97.757L4,22H20Z"/><path d="M8,9h8a1,1,0,0,0,0-2h-.635a3.523,3.523,0,0,0,.278-1.357,3.643,3.643,0,0,0-7.286,0A3.523,3.523,0,0,0,8.635,7H8A1,1,0,0,0,8,9Z"/></svg>
     </div>
     
   
     
     </div>
     <div className='w-full flex justify-center pt-8'>

    
     {
        searchingMatch? <button disabled className='bg-green-500 animate:pulse text-lg font-bold px-6 py-2 rounded-xl'>sending rematch request</button>:
        <button onClick={handleButtonClick} className='bg-green-500 text-lg font-bold px-6 py-2 rounded-xl'>Rematch</button>
     }
     </div>
     </div>
   
    </Modal>
  )
}
