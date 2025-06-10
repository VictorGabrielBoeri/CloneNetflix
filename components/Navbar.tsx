'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-90 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-red-600 text-2xl font-bold">
          NETFLIX
        </div>
        
        <div className="flex items-center space-x-6">
          <a href="#" className="text-white hover:text-gray-300">Início</a>
          <a href="#" className="text-white hover:text-gray-300">Séries</a>
          <a href="#" className="text-white hover:text-gray-300">Filmes</a>
          <a href="#" className="text-white hover:text-gray-300">Minha Lista</a>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white">{user.name}</span>
              <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Sair
              </button>
            </>
          ) : (
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Entrar
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar