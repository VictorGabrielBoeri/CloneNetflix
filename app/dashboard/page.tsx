'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { tmdbApi } from '@/lib/tmdb'
import VideoPlayer from '@/components/VideoPlayer'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedProfile, setSelectedProfile] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [movieCategories, setMovieCategories] = useState([])
  const [featuredContent, setFeaturedContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [currentTrailerUrl, setCurrentTrailerUrl] = useState('')

  useEffect(() => {
    const profile = localStorage.getItem('selected-profile')
    if (profile) {
      setSelectedProfile(profile)
    }
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      
      // Carregar conteúdo em paralelo
      const [trending, popularMovies, popularTV, actionMovies, comedyMovies] = await Promise.all([
        tmdbApi.getTrending('all', 'day'),
        tmdbApi.getPopularMovies(),
        tmdbApi.getPopularTVShows(),
        tmdbApi.getMoviesByGenre(28), // Ação
        tmdbApi.getMoviesByGenre(35)  // Comédia
      ])

      // Definir conteúdo em destaque (primeiro item trending)
      if (trending.results && trending.results.length > 0) {
        const featured = trending.results[0]
        setFeaturedContent({
          id: featured.id,
          title: featured.title || featured.name,
          description: featured.overview,
          image: tmdbApi.getImageUrl(featured.backdrop_path, 'w1280'),
          type: featured.media_type
        })
      }

      // Organizar categorias
      const categories = [
        {
          title: "Em Alta",
          items: trending.results?.slice(0, 10).map(item => ({
            id: item.id,
            title: item.title || item.name,
            image: tmdbApi.getImageUrl(item.poster_path),
            type: item.media_type,
            year: new Date(item.release_date || item.first_air_date).getFullYear(),
            rating: item.vote_average,
            overview: item.overview
          })) || []
        },
        {
          title: "Filmes Populares",
          items: popularMovies.results?.slice(0, 10).map(item => ({
            id: item.id,
            title: item.title,
            image: tmdbApi.getImageUrl(item.poster_path),
            type: 'movie',
            year: new Date(item.release_date).getFullYear(),
            rating: item.vote_average,
            overview: item.overview
          })) || []
        },
        {
          title: "Séries Populares",
          items: popularTV.results?.slice(0, 10).map(item => ({
            id: item.id,
            title: item.name,
            image: tmdbApi.getImageUrl(item.poster_path),
            type: 'tv',
            year: new Date(item.first_air_date).getFullYear(),
            rating: item.vote_average,
            overview: item.overview
          })) || []
        },
        {
          title: "Ação",
          items: actionMovies.results?.slice(0, 10).map(item => ({
            id: item.id,
            title: item.title,
            image: tmdbApi.getImageUrl(item.poster_path),
            type: 'movie',
            year: new Date(item.release_date).getFullYear(),
            rating: item.vote_average,
            overview: item.overview
          })) || []
        },
        {
          title: "Comédia",
          items: comedyMovies.results?.slice(0, 10).map(item => ({
            id: item.id,
            title: item.title,
            image: tmdbApi.getImageUrl(item.poster_path),
            type: 'movie',
            year: new Date(item.release_date).getFullYear(),
            rating: item.vote_average,
            overview: item.overview
          })) || []
        }
      ]

      setMovieCategories(categories)
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleMovieClick = async (item, category) => {
    try {
      let details, trailers
      if (item.type === 'tv') {
        [details, trailers] = await Promise.all([
          tmdbApi.getTVDetails(item.id),
          tmdbApi.getTVTrailers(item.id)
        ])
      } else {
        [details, trailers] = await Promise.all([
          tmdbApi.getMovieDetails(item.id),
          tmdbApi.getMovieTrailers(item.id)
        ])
      }

      const movieData = {
        ...item,
        category,
        year: item.year,
        rating: `${Math.round(item.rating * 10)}%`,
        duration: item.type === 'tv' ? `${details.number_of_seasons} temporada(s)` : `${details.runtime} min`,
        genre: details.genres?.map(g => g.name).join(', ') || 'N/A',
        description: item.overview,
        cast: details.credits?.cast?.slice(0, 5).map(actor => actor.name) || [],
        director: details.credits?.crew?.find(person => person.job === 'Director')?.name || 'N/A',
        trailers: trailers,
        episodes: item.type === 'tv' && details.seasons ? details.seasons.map((season, index) => ({
          number: season.season_number,
          title: season.name,
          duration: `${season.episode_count} episódios`,
          description: season.overview || 'Sem descrição disponível.'
        })) : null
      }
      
      setSelectedMovie(movieData)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
    }
  }

  const handlePlayTrailer = () => {
    if (selectedMovie?.trailers && selectedMovie.trailers.length > 0) {
      const trailer = selectedMovie.trailers[0] // Pegar o primeiro trailer
      const trailerUrl = tmdbApi.getYouTubeUrl(trailer.key)
      setCurrentTrailerUrl(trailerUrl)
      setShowVideoPlayer(true)
      setIsModalOpen(false)
    }
  }

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false)
    setCurrentTrailerUrl('')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMovie(null)
  }

  const handleQuickPlayTrailer = async (item) => {
    try {
      let trailers
      if (item.type === 'tv') {
        trailers = await tmdbApi.getTVTrailers(item.id)
      } else {
        trailers = await tmdbApi.getMovieTrailers(item.id)
      }
      
      if (trailers && trailers.length > 0) {
        const trailerUrl = tmdbApi.getYouTubeUrl(trailers[0].key)
        setCurrentTrailerUrl(trailerUrl)
        setSelectedMovie({ ...item, trailers })
        setShowVideoPlayer(true)
      } else {
        alert('Trailer não disponível para este conteúdo.')
      }
    } catch (error) {
      console.error('Erro ao carregar trailer:', error)
      alert('Erro ao carregar trailer.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-red-600 text-2xl font-bold">NETFLIX</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-gray-300">Início</a>
              <a href="#" className="hover:text-gray-300">Séries</a>
              <a href="#" className="hover:text-gray-300">Filmes</a>
              <a href="#" className="hover:text-gray-300">Bombando</a>
              <a href="#" className="hover:text-gray-300">Minha lista</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-300">🔍</button>
            <button className="hover:text-gray-300">🔔</button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-sm">
                {selectedProfile === 'andrea' ? '🐧' : selectedProfile === 'victor' ? '🐶' : selectedProfile === 'rodrigo' ? '🧁' : selectedProfile === 'isa' ? '🦊' : '🌸'}
              </div>
              <button onClick={handleLogout} className="text-sm hover:text-gray-300">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Content */}
      {featuredContent && (
        <div className="relative h-screen">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredContent.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
          </div>
          <div className="relative z-10 flex items-center h-full px-6">
            <div className="max-w-lg">
              <h2 className="text-5xl font-bold mb-4">{featuredContent.title}</h2>
              <p className="text-lg mb-6 text-gray-300">{featuredContent.description}</p>
              <div className="flex space-x-4">
                <button className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 flex items-center">
                  ▶️ Assistir
                </button>
                <button className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded font-bold hover:bg-opacity-50 flex items-center">
                  ℹ️ Mais informações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Categories */}
      <div className="px-6 pb-20 -mt-32 relative z-20">
        {movieCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className="flex-shrink-0 group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-10"
                    onClick={() => handleMovieClick(item, category.title)}
                  >
                    <div className="w-48 h-72 bg-gray-800 rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                      {/* Overlay com informações no hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end opacity-0 group-hover:opacity-100">
                        <div className="p-4 w-full">
                          <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
                          // No mapeamento dos cards, dentro do overlay:
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                handleQuickPlayTrailer(item)
                              }}
                              className="bg-white text-black px-3 py-1 rounded text-xs font-bold hover:bg-gray-200"
                            >
                              ▶️ Trailer
                            </button>
                            <button className="bg-gray-600 bg-opacity-70 text-white px-2 py-1 rounded text-xs hover:bg-opacity-90">
                              ➕
                            </button>
                            <button className="bg-gray-600 bg-opacity-70 text-white px-2 py-1 rounded text-xs hover:bg-opacity-90">
                              👍
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">{item.title}</p>
                  </div>
                ))}
                {/* Spacer para garantir que o último card seja visível */}
                <div className="flex-shrink-0 w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-80"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-gray-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>

            {/* Video Preview Section */}
            <div className="relative h-64 md:h-80 bg-black rounded-t-lg overflow-hidden">
              <img 
                src={selectedMovie.image} 
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-3xl font-bold mb-2">{selectedMovie.title}</h2>
                <div className="flex space-x-4">
                  {selectedMovie.trailers && selectedMovie.trailers.length > 0 ? (
                    <button 
                      onClick={handlePlayTrailer}
                      className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 flex items-center"
                    >
                      ▶️ Assistir Trailer
                    </button>
                  ) : (
                    <button className="bg-gray-600 text-white px-6 py-2 rounded font-bold opacity-50 cursor-not-allowed flex items-center">
                      ▶️ Trailer Indisponível
                    </button>
                  )}
                  <button className="bg-gray-600 bg-opacity-70 text-white px-4 py-2 rounded hover:bg-opacity-50">
                    ➕
                  </button>
                  <button className="bg-gray-600 bg-opacity-70 text-white px-4 py-2 rounded hover:bg-opacity-50">
                    👍
                  </button>
                  <button className="bg-gray-600 bg-opacity-70 text-white px-4 py-2 rounded hover:bg-opacity-50">
                    ⬇️
                  </button>
                </div>
              </div>
            </div>

            {/* Content Information */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-green-500 font-bold">{selectedMovie.rating}</span>
                    <span className="text-gray-400">{selectedMovie.year}</span>
                    <span className="border border-gray-500 px-2 py-1 text-xs">{selectedMovie.rating}</span>
                    <span className="text-gray-400">{selectedMovie.duration}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{selectedMovie.description}</p>
                  
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Elenco:</span> {selectedMovie.cast?.join(', ')}</p>
                    <p><span className="text-gray-400">Gêneros:</span> {selectedMovie.genre}</p>
                    <p><span className="text-gray-400">Diretor:</span> {selectedMovie.director}</p>
                  </div>
                </div>

                {/* Right Column - Episodes/Recommendations */}
                <div>
                  {selectedMovie.episodes && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Episódios</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedMovie.episodes.slice(0, 5).map((episode, index) => (
                          <div key={index} className="bg-gray-800 p-3 rounded">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{episode.number}. {episode.title}</h4>
                              <span className="text-sm text-gray-400">{episode.duration}</span>
                            </div>
                            <p className="text-sm text-gray-400">{episode.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      {showVideoPlayer && currentTrailerUrl && (
        <VideoPlayer
          url={currentTrailerUrl}
          title={`${selectedMovie?.title} - Trailer`}
          onClose={handleCloseVideoPlayer}
          autoPlay={true}
        />
      )}
    </div>
  )
}