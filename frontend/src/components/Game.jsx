/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "../socket";
import Modal from 'react-modal'


function Game({ players, room, orientation,color}) {
    
  const chess = useMemo(() => new Chess(), []); 
  const [fen, setFen] = useState(chess.fen()); 
  const [over, setOver] = useState("");



  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); 
        setFen(chess.fen()); 
  
        console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
  
        if (chess.isGameOver()) { 
          if (chess.isCheckmate()) { 
          
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            ); 
           
          } else if (chess.isDraw()) {
            setOver("Draw"); 
          } else {
            setOver("Game over");
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

    const playerColor = color[players.findIndex(player => player.id === socket.id)];
    const isPlayersTurn = chess.turn() === (playerColor === 'white' ? 'w' : 'b');
    if (!isPlayersTurn) return false;

 
    if (color === 'white' && chess.turn() !== 'w') return false; 
    if (color === 'black' && chess.turn() !== 'b') return false;  

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
    <div>
      <div>
        <div>Room ID: {room}</div>
      </div>
      <div>
        <div style={{
          maxWidth: 600,
          maxHeight: 600,
        }}>
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
          />
        </div>
        {players.length > 0 && (
          <div>
            <div>
              <h3>Players</h3>
              {players.map((player) => (
                <li key={player.id}>
                  <p>{player.username}</p>
                </li>
              ))}
            </div>
          </div>
        )}
      </div>
      <Modal 
        open={Boolean(over)}>
          {over}
        </Modal>
        
     
    </div>
  );
}
  
export default Game;
