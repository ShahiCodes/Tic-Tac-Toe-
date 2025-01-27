import React, { useState } from 'react'

const Square = ({value , onSquareClick}) => {
    
  return (
    <button
      className="w-24 h-24 items-center justify-center text-2xl font-bold text-white bg-gray-800 border border-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-700 focus:outline-none"
      onClick={onSquareClick}
      style={{ lineHeight: "1" }}
    >
      {value || <span>&nbsp;</span>}
    </button>
  )
}

export default Square