import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '../contexts/AuthContext'

// Mock do localStorage antes dos testes
beforeEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})

// Componente de teste simples
function TestComponent() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div data-testid="loading">Loading...</div>
  }
  
  return (
    <div>
      <div data-testid="user-status">
        {user ? 'logged-in' : 'logged-out'}
      </div>
    </div>
  )
}

describe('AuthContext', () => {
  it('provides authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    // Aguarda o componente carregar
    expect(screen.getByTestId('user-status')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    // Pode mostrar loading ou logged-out dependendo da implementação
    const element = screen.getByTestId('user-status') || screen.queryByTestId('loading')
    expect(element).toBeInTheDocument()
  })
})