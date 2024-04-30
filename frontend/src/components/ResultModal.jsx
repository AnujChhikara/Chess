/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */


import {useEffect, useState } from 'react';
import Modal from 'react-awesome-modal';
import socket from '../socket'


export default function ResultModal({gameStatus, result, cleanup, playerData, isModalOpen}) {
    const openValue = gameStatus || isModalOpen
    const [searchingMatch, setSearchingMatch] = useState(false)
    const [rematchOffer, setRematchOffer] = useState(false)
    const [rematchResponse, setRematchResponse] = useState(false)
    const[isOpen, setIsOpen] = useState(openValue)

  
      const handleCloseModal = () => {
        cleanup()
        setIsOpen(false)
      }

    const handleJoinQueue = () => {
      setSearchingMatch(true)
      socket.emit('joinQueue');
    };
    const handleRematchOffer = () => {
      setRematchOffer(true)
      socket.emit('rematch', playerData)
    }
  
    useEffect(() => { 
      socket.on('rematch' , () => {
      setRematchResponse(true)
      });
    }, []);
  
    const handleRematchResponse = (response) => {
      setRematchOffer(false)
      if(response){
       setIsOpen(false)
      }
      socket.emit('rematchResponse', { playerData: playerData, response: response}) 
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
       {
        result.status === 'timeout' && <div className=''>
          {result.winner === playerData.color? <div className='px-2 flex justify-around items-center pt-4'>
            <img className='w-12' src="https://www.svgrepo.com/show/484306/trophy.svg" alt="" />
            
            <div className='flex flex-col text-center'>
            <h4 className='font-bold text-2xl'>You Won!</h4>
            <p className='text-sm text-gray-400'>other player time runs out</p>
            </div>
        <button onClick={handleCloseModal}><img className='w-5' src="https://www.svgrepo.com/show/522087/cross.svg" alt="" /></button>

          </div> : <div  className='px-2 flex justify-around items-center pt-4'>
          <img className='w-16' src="https://www.svgrepo.com/show/348920/sad.svg" alt="" />
          <div className='flex flex-col text-center'>
            <h4 className='font-bold text-2xl'>You Lost!</h4>
            <p className='text-sm text-gray-400'>on time!</p>
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
    {
      rematchResponse?
       <div>
        <p>rematch offered</p>
        <div className="flex justify-around ">
       <button onClick={() => handleRematchResponse(true)} className="bg-zinc-900 px-2 py-1 rounded-lg">Accept</button> 
       <button onClick={() => handleRematchResponse(false)} className="bg-zinc-900 px-2 py-1 rounded-lg">Decline</button>
       </div></div>:   
        rematchOffer? <button disabled className='bg-green-500 animate-pulse text-lg font-bold px-6 py-2 rounded-xl'> waiting for response</button>:
        <button onClick={handleRematchOffer} className='bg-green-500 text-lg font-bold px-6 py-2 rounded-xl'>Rematch</button>
      
    }
    
</div>

    
     </div>

    
   
    </Modal>
  )
}
