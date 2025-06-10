'use client'

import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  title: string
  onClose: () => void
  autoPlay?: boolean
}

export default function VideoPlayer({ url, title, onClose, autoPlay = true }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoPlay)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [quality, setQuality] = useState('auto')
  
  const playerRef = useRef<ReactPlayer>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          setPlaying(!playing)
          break
        case 'ArrowLeft':
          seekTo(played - 0.1)
          break
        case 'ArrowRight':
          seekTo(played + 0.1)
          break
        case 'ArrowUp':
          setVolume(Math.min(1, volume + 0.1))
          break
        case 'ArrowDown':
          setVolume(Math.max(0, volume - 0.1))
          break
        case 'KeyM':
          setMuted(!muted)
          break
        case 'KeyF':
          toggleFullscreen()
          break
        case 'Escape':
          if (fullscreen) {
            setFullscreen(false)
          } else {
            onClose()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [playing, volume, muted, played, fullscreen, onClose])

  const seekTo = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time)
      setPlayed(time)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false)
      }
    }, 3000)
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 bg-black z-50 ${fullscreen ? 'cursor-none' : ''}`}
      onMouseMove={showControlsTemporarily}
      onClick={showControlsTemporarily}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={({ played }) => setPlayed(played)}
        onDuration={setDuration}
        onEnded={() => setPlaying(false)}
        config={{
          file: {
            attributes: {
              crossOrigin: 'anonymous'
            }
          }
        }}
      />
      
      {/* Fixed Back Button - Always Visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-4 left-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/70 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-black/90"
      >
        ← Voltar
      </button>
      
      {/* Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 pointer-events-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-white hover:text-gray-300 transition-colors bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-black/70"
            >
              ← Voltar
            </button>
            <h1 className="text-white text-xl font-semibold">{title}</h1>
            <div className="flex items-center space-x-4">
              <select 
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="bg-black/50 text-white rounded px-2 py-1"
              >
                <option value="auto">Auto</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Center Play/Pause */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setPlaying(!playing)}
            className="bg-black/50 rounded-full p-4 text-white hover:bg-black/70 transition-colors"
          >
            {playing ? <Pause size={48} /> : <Play size={48} />}
          </button>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={played}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => seekTo(Math.max(0, played - 10/duration))}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <SkipBack size={24} />
              </button>
              
              <button
                onClick={() => setPlaying(!playing)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {playing ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button
                onClick={() => seekTo(Math.min(1, played + 10/duration))}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <SkipForward size={24} />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value)
                    setVolume(newVolume)
                    setMuted(newVolume === 0)
                  }}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <span className="text-white text-sm">
                {formatTime(played * duration)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}