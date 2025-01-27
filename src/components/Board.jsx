import React, { useState } from 'react'
import { RiResetLeftFill } from "react-icons/ri";
import { RiRobot2Fill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import Square from './Square'

const Board = () => {
    const [xIsNext, setxIsNext] = useState(true)
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [isPvB, setIsPvB] = useState(false);

    function handleClick(i){
        if(squares[i] || calculateWinner(squares) || (isPvB && !xIsNext)){
            return
        }
        const nextSquare  = squares.slice();
        if(xIsNext){
            nextSquare[i] = 'X'
        }
        else{
            nextSquare[i] = 'O'
        }
        setSquares(nextSquare)
        // setxIsNext(!xIsNext)

        if (isPvB && xIsNext) {
          setTimeout(() => {
            setxIsNext(false); 
            botMove(nextSquare);
          }, 300); 
        } else {
          setxIsNext(!xIsNext); 
        }
    }

    function resetGame() {
        setSquares(Array(9).fill(null));
        setxIsNext(true);
    }


    function calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
    }

    
      function botMove(nextSquare) {
        setSquares((prevSquares) => {
          const availableMoves = prevSquares
            .map((val, index) => (val === null ? index : null))
            .filter((val) => val !== null);
      
          if (availableMoves.length === 0) return prevSquares; // No moves left
      
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          const updatedSquares = [...prevSquares];
          updatedSquares[randomMove] = 'O';
      
          setxIsNext(true);
      
          return updatedSquares; 
        });
      }
      
    

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (!squares.includes(null)) {
      status = 'Draw';
    } else {
      status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
    }

    const toggleGameMode = () => {
      setIsPvB(!isPvB);
      resetGame();
    };

return (
    <>
        <div className='text-2xl py-7  font-bold text-white'>{status}</div>
        <div>
            <Square value={squares[0]} onSquareClick={()=>handleClick(0)}/><Square value={squares[1]} onSquareClick={()=>handleClick(1)}/><Square value={squares[2]} onSquareClick={()=>handleClick(2)} />
        </div>
        <div>
            <Square value={squares[3]} onSquareClick={()=>handleClick(3)}/><Square value={squares[4]} onSquareClick={()=>handleClick(4)}/><Square value={squares[5]} onSquareClick={()=>handleClick(5)}/>
        </div>
        <div>
            <Square value={squares[6]} onSquareClick={()=>handleClick(6)}/><Square value={squares[7]} onSquareClick={()=>handleClick(7)}/><Square value={squares[8]} onSquareClick={()=>handleClick(8)}/>
        </div>
        <br />

        <div className='flex justify-center items-center'>
          <button
      className="px-6 py-3 flex items-center active:scale-90 gap-2 border-4 border-cyan-800 font-medium text-white bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg text-xl hover:border-gray-900 hover:shadow-lg hover:scale-105 transition-all duration-300"
      onClick={resetGame}>
      <RiResetLeftFill className="text-2xl" />
        Reset
      </button>
      
      <button
      className="px-6 py-3 flex items-center active:scale-90 gap-2 border-4 border-cyan-800 font-medium text-white bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg text-xl hover:border-gray-900 hover:shadow-lg hover:scale-105 transition-all duration-300"
      onClick={toggleGameMode}>
      
      {isPvB ? <><IoPerson /> Switch to PvP </>: <><RiRobot2Fill className="text-2xl" />Switch to PvB</>}
      </button>
      
      </div>

  
    </>
)
}

export default Board