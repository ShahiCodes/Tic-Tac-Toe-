import React, { useState } from 'react';
import { RiResetLeftFill, RiRobot2Fill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import Square from './Square';

const Board = () => {
  const [xIsNext, setxIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isPvB, setIsPvB] = useState(false);
  const [difficulty, setDifficulty] = useState('Hard'); // 'Easy' | 'Medium' | 'Hard'

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return; // Ignore clicks on already filled squares or after the game has ended
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O'; // Place X or O based on the current turn
    setSquares(nextSquares);

    // If it's PvB mode, make the bot move
    if (isPvB && !calculateWinner(nextSquares)) { // Only move if the game is not over
      setxIsNext(false); // Switch turn after the player moves
      setTimeout(() => {
        botMove(nextSquares);
      }, 300);
    } else {
      // In PvP mode, just toggle the turns between X and O
      setxIsNext(!xIsNext);
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setxIsNext(true);
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; // Return the winner ('X' or 'O')
      }
    }
    return null;
  }

  function botMove(nextSquares) {
    // Don't allow bot move if the game is already over
    if (calculateWinner(nextSquares)) {
      return;
    }

    let move;

    const availableMoves = nextSquares
      .map((val, i) => (val === null ? i : null))
      .filter((val) => val !== null);

    if (availableMoves.length === 0) return;

    if (difficulty === 'Easy') {
      move = getRandomMove(availableMoves);
    } else if (difficulty === 'Medium') {
      move = Math.random() < 0.5 ? getRandomMove(availableMoves) : getBestMove(nextSquares);
    } else {
      move = getBestMove(nextSquares);
    }

    const updatedSquares = [...nextSquares];
    updatedSquares[move] = 'O';
    setSquares(updatedSquares);
    setxIsNext(true);
  }

  function getRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  function getBestMove(squares) {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  }

  function minimax(squares, depth, isMaximizing) {
    const winner = calculateWinner(squares);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (!squares.includes(null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
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

  const changeDifficulty = (level) => {
    setDifficulty(level);
    resetGame();
  };

  return (
    <>
      <div className='text-2xl py-7 font-bold text-white'>{status}</div>

      <div>
        {[0, 3, 6].map(row => (
          <div key={row}>
            <Square value={squares[row]} onSquareClick={() => handleClick(row)} />
            <Square value={squares[row + 1]} onSquareClick={() => handleClick(row + 1)} />
            <Square value={squares[row + 2]} onSquareClick={() => handleClick(row + 2)} />
          </div>
        ))}
      </div>

      <br />

      <div className='flex flex-wrap justify-center items-center gap-4'>
        <button
          className="px-6 py-3 flex items-center active:scale-90 gap-2 border-4 border-cyan-800 font-medium text-white bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg text-xl hover:border-gray-900 hover:shadow-lg hover:scale-105 transition-all duration-300"
          onClick={resetGame}>
          <RiResetLeftFill className="text-2xl" />
          Reset
        </button>

        <button
          className="px-6 py-3 flex items-center active:scale-90 gap-2 border-4 border-cyan-800 font-medium text-white bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg text-xl hover:border-gray-900 hover:shadow-lg hover:scale-105 transition-all duration-300"
          onClick={toggleGameMode}>
          {isPvB ? <><IoPerson /> Switch to PvP</> : <><RiRobot2Fill /> Switch to PvB</>}
        </button>

        {isPvB && (
          <div className="flex items-center gap-2 text-white">
            <span>Difficulty:</span>
            {['Easy', 'Medium', 'Hard'].map(level => (
              <button
                key={level}
                className={`px-3 py-1 rounded-lg border ${
                  difficulty === level ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
                } hover:scale-105 transition`}
                onClick={() => changeDifficulty(level)}
              >
                {level}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Board;
