'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      router.push('/')
    } catch (err) {
      setError('Email ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para login de demonstração
  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Fazer login automático com credenciais demo
      await login('demo@netflix.com', 'demo123')
      router.push('/')
    } catch (err) {
      setError('Erro no login de demonstração')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/6863f6e8-d419-414d-b5b9-7ef657e67ce4/web/BR-pt-20250602-TRIFECTA-perspective_1baa3590-d9af-4363-9c2d-01b3a7897985_large.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Header com logo Netflix */}
      <div className="absolute top-0 left-0 w-full p-6 z-10">
        <div className="text-red-600 text-3xl font-bold">
          NETFLIX
        </div>
      </div>

      {/* Formulário de login */}
      <div className="relative z-10 bg-black bg-opacity-75 p-16 rounded-lg w-full max-w-md mx-4">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-6">Entrar</h1>
        </div>

        {error && (
          <div className="bg-orange-600 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email ou número de celular"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-700 bg-opacity-70 text-white rounded border border-gray-600 focus:outline-none focus:border-white focus:bg-gray-600"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-700 bg-opacity-70 text-white rounded border border-gray-600 focus:outline-none focus:border-white focus:bg-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-colors disabled:opacity-50 text-lg"
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Entrar'}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-sm">
          <label className="flex items-center text-gray-300">
            <input type="checkbox" className="mr-2" />
            Lembre-se de mim
          </label>
          <a href="#" className="text-gray-300 hover:underline">
            Precisa de ajuda?
          </a>
        </div>

        <div className="mt-8">
          <button
            onClick={handleDemoLogin}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded transition-colors mb-4"
          >
            🎬 Entrar como Demo
          </button>
        </div>

        <div className="mt-6 text-gray-400">
          <p>
            Novo por aqui?{' '}
            <a href="/auth/register" className="text-white hover:underline font-bold">
              Assine agora
            </a>
            .
          </p>
          <p className="text-xs mt-2">
            Esta página é protegida pelo Google reCAPTCHA para garantir que você não é um robô.{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Saiba mais
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}