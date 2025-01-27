import React from 'react'
import './App.css'
import Square from './components/Square'
import Board from './components/Board'


const App = () => {
  return (
    <div>
    <Board></Board>
      
      <h1 className='py-4 text-text-2xl text-gray-400 border-red-400 font-light'> Tic-Tac-Toe </h1>
    </div>
  )
}

export default App