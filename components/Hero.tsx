'use client'

import React from 'react'

const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-r from-black to-red-900">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Filmes, séries e muito mais. Sem limites.</h1>
        <p className="text-xl mb-8">Assista onde quiser. Cancele quando quiser.</p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded text-lg">
          Começar a assistir
        </button>
      </div>
    </div>
  )
}

export default Hero