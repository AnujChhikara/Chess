/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */


import {useState } from 'react';
import Modal from 'react-awesome-modal';
import socket from '../socket'



export default function ResultModal({gameStatus, result, roomId, cleanup, playerData}) {

    const [searchingMatch, setSearchingMatch] = useState(false) 
    let winner = result.winner
    const[isOpen, setIsOpen] = useState(gameStatus)
  
      const handleCloseModal = () => {
        console.log('click')
        cleanup()
        setIsOpen(false)
      }

    const handleJoinQueue = () => {
      cleanup()
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
  <div className='w-full h-full  space-y-4  flex-flex-col justify-center items-center bg-[#0c0c0c] text-white'>
     <div className='bg-[#20201f] w-full h-1/4'>
       {/* img based on result */}
       {
        result.status === 'draw' && <div className='px-2 flex justify-center space-x-6 items-center pt-4'>
        <div className='text-center'>
        <h4 className='font-bold text-2xl'>Game Draw!</h4>
        <p className='text-[12px] w-44 text-gray-400'>Kings danced, knights napped, draw declared.</p>
        </div>
        <button onClick={handleCloseModal}><img className='w-5' src="https://www.svgrepo.com/show/522087/cross.svg" alt="" /></button>
        
    

        </div> 
       } 
      {
        result.status === 'checkmate' && <div className=''>
          {result.winner === playerData.color? <div className='px-2 flex justify-around items-center pt-4'>
            <img className='w-12' src="https://www.svgrepo.com/show/484306/trophy.svg" alt="" />
            
            <div className='flex flex-col text-center'>
            <h4 className='font-bold text-2xl'>You Won!</h4>
            <p className='text-sm text-gray-400'>by checkmate</p>
            </div>
        <button onClick={handleCloseModal}><img className='w-5' src="https://www.svgrepo.com/show/522087/cross.svg" alt="" /></button>

          </div> : <div  className='px-2 flex justify-around items-center pt-4'>
          <img className='w-16' src="https://www.svgrepo.com/show/348920/sad.svg" alt="" />
          <div className='flex flex-col text-center'>
            <h4 className='font-bold text-2xl'>You Lost!</h4>
            <p className='text-sm text-gray-400'>by checkmate</p>
            </div>
        <button onClick={handleCloseModal}><img className='w-5' src="https://www.svgrepo.com/show/522087/cross.svg" alt="" /></button>
          </div> }
           
     
        </div>
      } {
        result.status === 'disconnect' && 
         <div className='px-2 flex justify-around items-center pt-4'>
            <img className='w-12' src="https://www.svgrepo.com/show/484306/trophy.svg" alt="" />
            <div className='flex flex-col text-center'>
            <h4 className='font-bold text-2xl'>You Won!</h4>
            <p className='text-sm text-gray-400'>by game abandoned</p>
            </div>
        <button onClick={handleCloseModal}><img className='w-5' src="https://www.svgrepo.com/show/522087/cross.svg" alt="" /></button>

          </div> 
           
      }    
       {
        result.status === 'resignation' && <div className=''>
        {result.winner === playerData.color? <div className='px-2 flex justify-around items-center pt-4'>
          <img className='w-12' src="https://www.svgrepo.com/show/484306/trophy.svg" alt="" />
          
          <div className='flex flex-col text-center'>
          <h4 className='font-bold text-2xl'>You Won!</h4>
          <p className='text-sm text-gray-400'>by resignation</p>
          </div>
      <button onClick={handleCloseModal}><img className='w-5' src="https://www.svgrepo.com/show/522087/cross.svg" alt="" /></button>

        </div> : <div  className='px-2 flex justify-around items-center pt-4'>
        <img className='w-16' src="https://www.svgrepo.com/show/348920/sad.svg" alt="" />
        <div className='flex flex-col text-center'>
          <h4 className='font-bold text-2xl'>You Lost!</h4>
          <p className='text-sm text-gray-400'>by resignation</p>
          </div>
      <button onClick={handleCloseModal}><img className='w-5' src="https://www.svgrepo.com/show/522087/cross.svg" alt="" /></button>
        </div> }
         
   
      </div>
        
           
      }         
     </div>
     <div className=' flex justify-center pt-8'>
    {
      searchingMatch? <button disabled className='bg-green-500 animate-pulse text-lg font-bold px-6 py-2 rounded-xl'>finding players..</button>:
      <button onClick={handleJoinQueue} className='bg-green-500 text-lg font-bold px-6 py-2 rounded-xl'>New Match</button>
    }
</div>

    
     </div>

    
   
    </Modal>
  )
}
