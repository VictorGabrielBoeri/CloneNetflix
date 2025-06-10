import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoPlayer from '../components/VideoPlayer'

// Mock do ReactPlayer
jest.mock('react-player', () => {
  return function MockReactPlayer(props: any) {
    return <div data-testid="react-player" {...props} />
  }
})

const defaultProps = {
  url: 'https://example.com/video.mp4',
  title: 'Test Video',
  onClose: jest.fn(),
  autoPlay: true
}

describe('VideoPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<VideoPlayer {...defaultProps} />)
    expect(screen.getByTestId('react-player')).toBeInTheDocument()
  })

  it('displays the video title', () => {
    render(<VideoPlayer {...defaultProps} />)
    expect(screen.getByText('Test Video')).toBeInTheDocument()
  })

  it('calls onClose when any back button is clicked', () => {
    render(<VideoPlayer {...defaultProps} />)
    // Pega todos os botões "← Voltar" e clica no primeiro
    const backButtons = screen.getAllByText('← Voltar')
    expect(backButtons.length).toBeGreaterThan(0)
    fireEvent.click(backButtons[0])
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when escape key is pressed', () => {
    render(<VideoPlayer {...defaultProps} />)
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })
})