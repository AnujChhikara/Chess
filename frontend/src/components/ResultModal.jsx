/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */


import {useState } from 'react';
import Modal from 'react-awesome-modal';
import socket from '../socket'



export default function ResultModal({gameStatus, result, roomId, cleanup}) {

    const [searchingMatch, setSearchingMatch] = useState(false) 
    let winner = result.winner
    const[isOpen, setIsOpen] = useState(gameStatus)
  
      const handleCloseModal = () => {
        console.log('click')
        cleanup()
        setIsOpen(false)
      }

   let response = ''
    if(result.status === 'disconnect'){
      response = `${result.winner === 'white' ? 'Black' : 'white'} player got disconnected!`
    } else if (result.status === 'checkmate'){
      response= `Checkmate! ${result.winner} Won the game!`
    } else{
      response = 'Draw!'
    }

    const handleJoinQueue = () => {
      setIsOpen(false)
      setSearchingMatch(true)
      socket.emit('joinQueue');
    };
   
      
  return (
    <Modal className=""
     visible={isOpen}
        width="300"
        height="400"
        effect="fadeInUp"
       
        >
  <div className='w-full h-full  space-y-4  flex-flex-col justify-center items-center bg-[#20201f] text-white'>
     <div className='bg-[#333330] w-full h-1/4'>
       {/* img based on result */}
       {
        result.status === 'draw' && <div className='px-2 flex justify-around items-center pt-4'>
        <img className='h-16' src="https://img.icons8.com/external-flat-icons-inmotus-design/67/external-Half-mathematics-geometry-flat-icons-inmotus-design.png" alt="external-Half-mathematics-geometry-flat-icons-inmotus-design"/>
        <h4 className='font-bold text-2xl'>Game Draw!</h4>
        <button onClick={handleCloseModal}><img className='w-6' src="https://www.svgrepo.com/show/475751/cross.svg" alt="" /></button>
        
    

        </div> 
       } 
      {
        result.status === 'checkmate' && <div>
           <img className='w-16' src="https://www.svgrepo.com/show/484306/trophy.svg" alt="" />
       <img className='w-16' src="https://www.svgrepo.com/show/348920/sad.svg" alt="" />
        </div>
      }
      
      
       
     </div>

    
     </div>
   
    </Modal>
  )
}
