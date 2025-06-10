import '@testing-library/jest-dom'
import React from 'react'

// Mock do Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams()
}))

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do ReactPlayer corrigido
jest.mock('react-player', () => {
  const MockReactPlayer = React.forwardRef((props, ref) => {
    const { playing, onDuration, onProgress, onReady, ...otherProps } = props
    return React.createElement('div', {
      'data-testid': 'react-player',
      ref,
      ...otherProps
    })
  })
  MockReactPlayer.displayName = 'MockReactPlayer'
  return MockReactPlayer
})

// Mock do Next.js Image
jest.mock('next/image', () => {
  return function MockImage(props) {
    const { src, alt, ...otherProps } = props
    return React.createElement('img', {
      src,
      alt,
      ...otherProps
    })
  }
})

// Configuração global
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))
global.React = React