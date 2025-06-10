'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  subscription?: {
    plan: string
    status: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Simular usuário logado
      setUser({
        id: '1',
        email: 'demo@netflix.com',
        name: 'Demo User'
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simular login
    const mockUser = {
      id: '1',
      email: email,
      name: 'Demo User'
    }
    
    localStorage.setItem('token', 'demo-token')
    setUser(mockUser)
    
    // Redirecionar para página de perfis
    router.push('/profiles')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('selected-profile')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}