/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "../socket";
import ResultModal from "./ResultModal";

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function Game({ players, room, cleanup}) {
    
  const chess = useMemo(() => new Chess(), []); 
  const [fen, setFen] = useState(chess.fen()); 
  const [result, setResult] = useState({
    result:'',
    winner:''
  });
  const [gameStatus, setGameStatus] = useState(false)
  const [isResign, setIsResign] = useState(false)
  const[playerData, setPlayerData] = useState('')
  const[whiteTimer, setWhiteTimer] = useState(600)
  const[blackTimer, setBlackTimer] = useState(600)
  const[drawOffered, setDrawOffered] = useState(false)
   const whoseTurn = chess.turn()
 

  useEffect(()=> {
    if(players.length > 0){
      const playerIndex = players.findIndex(player => player.id === socket.id)
      const playerData = players[playerIndex]
      setPlayerData(playerData)
    }
  }, [players])

 
  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); 
        setFen(chess.fen()); 
  
        if (chess.isGameOver()) { 
         setGameStatus(true)
          if (chess.isCheckmate()) { 
            
            setResult(
              {
                status:'checkmate',
                winner: `${chess.turn() === "w" ? "black" : "white"}`
              }
            ); 
           
          } else if (chess.isDraw()) {
            setResult(
              {
                status:'draw',
                winner: ''
              }
            ); 
           
          } else {
            setResult("Game over");
          }
        }
  
        return result;
      } catch (e) {
        return null;
      }
    },
    [chess]
  );


  function onDrop(sourceSquare, targetSquare) {

    const playerColor = playerData.color
    const isPlayersTurn = chess.turn() === (playerColor === 'white' ? 'w' : 'b');
    if (!isPlayersTurn) return false;

 
    if (playerData.color === 'white' && chess.turn() !== 'w') return false; 
    if (playerData.color === 'black' && chess.turn() !== 'b') return false;  

    if (players.length < 2) return false; 

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q", 
    };
  
    const move = makeAMove(moveData);

    if (move === null) return false;
    socket.emit("move", { move, room });
  
    return true; 
  }

  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move); //
    });
    
  }, [makeAMove]);

//player disconnected socket
  useEffect(() => {
    socket.on('playerDisconnected', (player) => {
      setGameStatus(true)
      setResult({
        status:'disconnect',
        winner:`${player.playername === playerData.playername? playerData.color==='white'? 'black': 'white': playerData.color==='white'? 'white': 'black'}`
      }); 
      
    });
  
  }, [playerData]);


//handle resign button
  const handleResign = () => {
    setIsResign(true)
    socket.emit('resignation', playerData);
    setGameStatus(true)
    setResult({
      status:'resignation',
      winner:`${playerData.color === 'white'? 'black' : 'white'}`
    }); 
  };

  useEffect(() => {
    socket.on('resignation', (player) => {
      setGameStatus(true)
      setResult({
        status:'resignation',
        winner:`${player.playername === playerData.playername? playerData.color==='white'? 'black': 'white': playerData.color==='white'? 'white': 'black'}`
      }); 
    });
  }, [isResign, playerData]);

  //handle draw offer

  const handleDrawOffer = () => {
    socket.emit('drawOffer', playerData)
  }

  useEffect(() => {
    socket.on('drawOffer' , () => {
    setDrawOffered(true)
    });
  }, []);

  const handleDrawResponse = (response) => {
    setDrawOffered(false)
    socket.emit('drawResponse', { playerData: playerData, response: response }) 
    if(response){
      setGameStatus(true)
      setResult({
        status:'draw',
        winner:''})
    }
  };

  //draw accepted or not
  useEffect(() => {
    socket.on('drawResponse', (response) => {
     if(response){
      setGameStatus(true)
      setResult({
        status:'draw',
        winner: ''
      }); 
     }
    });
  }, [playerData]);



  useEffect(() => {
    
      const interval = setInterval(() => {
        if (whoseTurn === "b") {
          setWhiteTimer((prev) => (prev > 0 ? prev - 1 : prev)); // Decrease white timer
        } else {
          setBlackTimer((prev) => (prev > 0 ? prev - 1 : prev)); // Decrease black timer
        }
      }, 1000);
  
      return () => {
        clearInterval(interval);
        
      };
    
  }, [whoseTurn]);

  return (
 
    <div className="bg-black w-screen h-screen " >
       
        <div className={`px-20 pt-20 flex bg-black  space-x-8`}>
        {playerData && <div>
          {gameStatus && <ResultModal result={result} gameStatus={gameStatus} playerData={playerData} roomId={room} cleanup={cleanup}/>}
        

          <div>  
          <Chessboard
          position={fen}
          boardWidth={500}
          onPieceDrop={onDrop}
          boardOrientation={playerData.color}  
        /> </div>
          </div>}

            
          {playerData && !gameStatus && playerData.index === 0 && ( <div className="flex flex-col h-[500px] justify-between">
            <div className={`text-lg bg-zinc-800 px-4 flex space-x-2 py-2 rounded-md font-bold `}><p className="bg-black px-2 py-1 rounded-lg mr-3">{formatTime(whiteTimer)}</p><h5 >{players[1].playername} ({players[1].rating})</h5> </div>
            {
              drawOffered && <div className="flex  flex-col space-y-4 px-4 py-2 border rounded-xl shadow-white shadow-sm border-zinc-900">
            <p className="text-lg font-bold">Other player offered a draw</p>
            <div className="flex justify-around ">
            <button onClick={() => handleDrawResponse(true)} className="bg-zinc-900 px-2 py-1 rounded-lg">Accept</button> 
            <button onClick={() => handleDrawResponse(false)} className="bg-zinc-900 px-2 py-1 rounded-lg">Decline</button>
            </div>
          
              </div>
            }
            <div className="flex flex-col items-start space-y-3">
            <button onClick={handleResign} className="bg-zinc-900 p-2 rounded w-12">
            <svg className="h-5 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#bababa">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <path d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7" stroke="#bababa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </g>
            </svg>
            </button>

            <button onClick={handleDrawOffer} className="bg-zinc-900 p-2 rounded font-bold w-12">
              1/2
            </button>
            <div className={`text-lg bg-zinc-800 px-4 flex space-x-2 py-2 rounded-md font-bold `}><p className="bg-black px-2 py-1 rounded-lg mr-3">{formatTime(blackTimer)}</p> {playerData.playername}({playerData.rating})</div>
           </div>
           </div>

          )}

           {playerData && !gameStatus && playerData.index === 1 && (
           <div className="flex flex-col h-[500px] justify-between">
            <div className={`text-lg bg-zinc-800 px-4 py-2 flex space-x-2 rounded-md font-bold `}><p className="bg-black px-2 py-1 rounded-lg mr-3">{formatTime(blackTimer)}</p> {players[0].playername}({players[0].rating})</div>
            {
           drawOffered && <div className="flex  flex-col space-y-4 px-4 py-2 border rounded-xl shadow-white shadow-sm border-zinc-900">
        <p className="text-lg font-bold">Other player offered a draw</p>
        <div className="flex justify-around ">
        <button onClick={() => handleDrawResponse(true)} className="bg-zinc-900 px-2 py-1 rounded-lg">Accept</button> 
        <button onClick={() => handleDrawResponse(false)} className="bg-zinc-900 px-2 py-1 rounded-lg">Decline</button>
        </div>
      
      </div>
    }
            <div className="flex flex-col items-start space-y-3">
            <button onClick={handleResign} className="bg-zinc-900 p-2 rounded w-12">
            <svg className="h-5 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#bababa">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <path d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7" stroke="#bababa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </g>
            </svg>
            </button>

            <button onClick={handleDrawOffer} className="bg-zinc-900 p-2 rounded font-bold w-12">
              1/2
            </button>
              <div className={`text-lg bg-zinc-800 px-4 py-2 flex space-x-2 rounded-md font-bold `}><p className="bg-black px-2 py-1 rounded-lg mr-3">{formatTime(whiteTimer)}</p> {playerData.playername}({playerData.rating})</div>
            </div>
           
           </div>
            
          )}
     
    </div>
 
      </div>
        

  );
}
  
export default Game;
