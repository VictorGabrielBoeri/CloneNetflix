'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!loading && user) {
      // Se usuário está logado, redirecionar para perfis
      router.push('/profiles')
    }
  }, [user, loading, router])

  const handleLoginRedirect = () => {
    router.push('/auth/login')
  }

  const handleGetStarted = () => {
    if (email) {
      localStorage.setItem('signup-email', email)
    }
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Se usuário está logado, não mostrar a landing page
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-red-600 text-3xl font-bold">
            NETFLIX
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600">
              <option>Português</option>
              <option>English</option>
            </select>
            <button 
              onClick={handleLoginRedirect}
              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm font-semibold"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(http://assets.nflxext.com/ffe/siteui/vlv3/6863f6e8-d419-414d-b5b9-7ef657e67ce4/web/BR-pt-20250602-TRIFECTA-perspective_1baa3590-d9af-4363-9c2d-01b3a7897985_large.jpg)'
          }}
        ></div>
        
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Filmes, séries e muito<br />mais, sem limites
          </h1>
          <p className="text-xl md:text-2xl mb-4">
            A partir de R$ 20,90. Cancele quando quiser.
          </p>
          <p className="text-lg mb-8">
            Quer assistir? Informe seu email para criar ou reiniciar sua assinatura.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-black rounded text-lg w-full md:w-auto min-w-[300px]"
            />
            <button 
              onClick={handleGetStarted}
              className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded text-lg font-semibold flex items-center"
            >
              Vamos lá
              <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* ... resto do conteúdo da landing page ... */}
    </div>
  )
}