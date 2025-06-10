const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

export const tmdbApi = {
  // Filmes populares
  getPopularMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    return response.json();
  },

  // Séries populares
  getPopularTVShows: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    return response.json();
  },

  // Trending (em alta)
  getTrending: async (mediaType = 'all', timeWindow = 'day') => {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  // Buscar filmes/séries
  searchMulti: async (query, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.json();
  },

  // Detalhes do filme
  getMovieDetails: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits,videos`
    );
    return response.json();
  },

  // Detalhes da série
  getTVDetails: async (tvId) => {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits,videos`
    );
    return response.json();
  },

  // Filmes por gênero
  getMoviesByGenre: async (genreId, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&page=${page}`
    );
    return response.json();
  },

  // Séries por gênero
  getTVByGenre: async (genreId, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&page=${page}`
    );
    return response.json();
  },

  // Gêneros de filmes
  getMovieGenres: async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  // Gêneros de TV
  getTVGenres: async () => {
    const response = await fetch(
      `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=pt-BR`
    );
    return response.json();
  },

  // Função para construir URL da imagem
  getImageUrl: (path, size = 'w500') => {
    if (!path) return '/placeholder-image.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Buscar trailers de filmes
  getMovieTrailers: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    // Filtrar apenas trailers do YouTube
    return data.results?.filter(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || [];
  },

  // Buscar trailers de séries
  getTVTrailers: async (tvId) => {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    // Filtrar apenas trailers do YouTube
    return data.results?.filter(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || [];
  },

  // Construir URL do YouTube para o trailer
  getYouTubeUrl: (videoKey) => {
    return `https://www.youtube.com/watch?v=${videoKey}`;
  },
};