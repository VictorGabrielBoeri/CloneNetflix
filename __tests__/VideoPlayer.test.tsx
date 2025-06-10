import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoPlayer from '../components/VideoPlayer'

const defaultProps = {
  url: 'https://example.com/video.mp4',
  title: 'Test Video',
  onClose: jest.fn(),
  isPlaying: true,
  onPlayPause: jest.fn()
}

describe('VideoPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders video player with title', () => {
    render(<VideoPlayer {...defaultProps} />)
    expect(screen.getByText('Test Video')).toBeInTheDocument()
  })

  it('calls onClose when back button is clicked', () => {
    render(<VideoPlayer {...defaultProps} />)
    // Procura por "Voltar" em vez de "← Back"
    const backButtons = screen.getAllByText(/voltar/i)
    fireEvent.click(backButtons[0])
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('handles escape key press', () => {
    render(<VideoPlayer {...defaultProps} />)
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('renders ReactPlayer component', () => {
    render(<VideoPlayer {...defaultProps} />)
    expect(screen.getByTestId('react-player')).toBeInTheDocument()
  })
})