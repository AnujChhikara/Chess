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

function Game({ players, room}) {
    
  const chess = useMemo(() => new Chess(), []); 
  const [fen, setFen] = useState(chess.fen()); 
  const [result, setResult] = useState({
    result:'',
    winner:''
  });
  const [gameStatus, setGameStatus] = useState(false)
  const[playerData, setPlayerData] = useState('')
  const[whiteTimer, setWhiteTimer] = useState(600)
  const[blackTimer, setBlackTimer] = useState(600)

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


  useEffect(() => {
    socket.on('playerDisconnected', (player) => {
      setGameStatus(true)
      setResult({
        status:'disconnect',
        winner:`${player.playername === playerData.playername? playerData.color==='white'? 'black': 'white': playerData.color==='white'? 'white': 'black'}`
      }); 
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
          {gameStatus && <ResultModal result={result} gameStatus={gameStatus} roomId={room} playerData={playerData}/>}
        

          <div>  
          <Chessboard
          position={fen}
          boardWidth={600}
          onPieceDrop={onDrop}
          boardOrientation={playerData.color}  
        /> </div>
          </div>}

            
          {playerData && playerData.index === 0 && ( <div className="flex flex-col h-[600px] justify-between">
            <div className={`text-lg bg-zinc-800 px-4 flex space-x-2 py-2 rounded-md font-bold ${chess.turn()==='w'? '': 'animate-pulse'} `}><p className="bg-black px-2 py-1 rounded-lg mr-3">{formatTime(whiteTimer)}</p><h5 >{players[1].playername} ({players[1].rating})</h5> </div>
            <div className={`text-lg bg-zinc-800 px-4 flex space-x-2 py-2 rounded-md font-bold ${chess.turn()==='w'? 'animate-pulse': ''}`}><p className="bg-black px-2 py-1 rounded-lg mr-3">{formatTime(blackTimer)}</p> {playerData.playername}({playerData.rating})</div>
           </div>

          )}

           {playerData && playerData.index === 1 && (
           <div className="flex flex-col h-[600px] justify-between">
            <div className={`text-lg bg-zinc-800 px-4 py-2 flex space-x-2 rounded-md font-bold ${chess.turn()==='w'? 'animate-pulse': ''}`}><p className="bg-black px-2 py-1 rounded-lg mr-3">{formatTime(blackTimer)}</p> {players[0].playername}({players[0].rating})</div>
            <div className={`text-lg bg-zinc-800 px-4 py-2 flex space-x-2 rounded-md font-bold ${chess.turn()==='w'? '': 'animate-pulse'}`}><p className="bg-black px-2 py-1 rounded-lg mr-3">{formatTime(whiteTimer)}</p> {playerData.playername}({playerData.rating})</div>
           </div>

          )}
     
    </div>
      </div>
        

  );
}
  
export default Game;
