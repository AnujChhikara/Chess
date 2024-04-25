/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "../socket";


function Game({ players, room}) {
    
  const chess = useMemo(() => new Chess(), []); 
  const [fen, setFen] = useState(chess.fen()); 
  const [result, setResult] = useState();
  const [gameStatus, setGameStatus] = useState(false)
  const[playerData, setPlayerData] = useState('')

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
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            ); 
           
          } else if (chess.isDraw()) {
            setResult("Draw"); 
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

  
  return (
 
    <div className="bg-black w-screen h-screen " >
        {gameStatus?   (
          <div className="text-center  flex items-center justify-center">
            <img src="./chessboard.png" className="opacity-20" alt="" />
           <div className="w-80 bg-gray-800 fixed h-80 border-4 text-center border-double">
           <p>Game Result:- {result}</p>
           <button  className="bg-green-500 px-6 py-2 rounded-lg">New Match</button>
           </div>
          </div>
        )  :
        <div className={`px-20 pt-20 flex bg-black  space-x-8`}>
        {playerData && <div>
        

          <div>  
          <Chessboard
          position={fen}
          boardWidth={600}
          onPieceDrop={onDrop}
          boardOrientation={playerData.color}  
        /> </div>
          </div>}

            
          {playerData && playerData.index === 0 && ( <div className="flex flex-col h-[600px] justify-between">
            <h3 className={`text-lg bg-zinc-800 px-4 py-2 rounded-md font-bold ${chess.turn()==='w'? '': 'animate-pulse'} `}>{players[1].playername} ({players[1].rating})</h3>
            <h3 className={`text-lg bg-zinc-800 px-4 py-2 rounded-md font-bold ${chess.turn()==='w'? 'animate-pulse': ''}`}>{playerData.playername}({playerData.rating})</h3>
           </div>

          )}

           {playerData && playerData.index === 1 && (
           <div className="flex flex-col h-[600px] justify-between">
            <h3 className={`text-lg bg-zinc-800 px-4 py-2 rounded-md font-bold ${chess.turn()==='w'? 'animate-pulse': ''}`}>{players[0].playername}({players[0].rating})</h3>
            <h3 className={`text-lg bg-zinc-800 px-4 py-2 rounded-md font-bold ${chess.turn()==='w'? '': 'animate-pulse'}`}>{playerData.playername}({playerData.rating})</h3>
           </div>

          )}
     
    </div>
      
      } 


      </div>
        

  );
}
  
export default Game;
