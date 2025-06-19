const API = {
  apiKey: "e8135952f47aadfa187cff53f4f6765e",
  baseUrl: "https://api.themoviedb.org/3",
  imageBaseUrl: "https://image.tmdb.org/t/p/",
  posterSize: "w500",
  backdropSize: "w1280",
  language: "pt-BR",

  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODEzNTk1MmY0N2FhZGZhMTg3Y2ZmNTNmNGY2NzY1ZSIsIm5iZiI6MTY3MjQ0NzcyMS40NDMsInN1YiI6IjYzYWY4NmU5NWFkNzZiMDBjZjQxZDg1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xsTlucj_BsTD-3SR1XhpljTMVixzXiKm8IIswSSkrdo",
    "Content-Type": "application/json;charset=utf-8",
  },

  getPopularMovies: async function () {
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=${this.language}`
      );
      const data = await response.json();
      return this.formatMovies(data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes populares:", error);
      return this.getOfflineMovies().popular;
    }
  },

  getPopularTVShows: async function () {
    try {
      const response = await fetch(
        `${this.baseUrl}/tv/popular?api_key=${this.apiKey}&language=${this.language}`
      );
      const data = await response.json();
      return this.formatTVShows(data.results);
    } catch (error) {
      console.error("Erro ao buscar séries populares:", error);
      return this.getOfflineMovies().trending;
    }
  },

  getActionMovies: async function () {
    try {
      const response = await fetch(
        `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=${this.language}&with_genres=28`
      );
      const data = await response.json();
      return this.formatMovies(data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes de ação:", error);
      return this.getOfflineMovies().action;
    }
  },

  getNewReleases: async function () {
    try {
      const date = new Date();
      const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
        .toISOString()
        .split("T")[0];
      const today = new Date().toISOString().split("T")[0];

      const response = await fetch(
        `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=${this.language}&primary_release_date.gte=${lastMonth}&primary_release_date.lte=${today}&sort_by=release_date.desc`
      );
      const data = await response.json();
      return this.formatMovies(data.results);
    } catch (error) {
      console.error("Erro ao buscar lançamentos:", error);
      return this.getOfflineMovies().newReleases;
    }
  },

  getMovieDetails: async function (id) {
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=${this.language}&append_to_response=videos,credits`
      );
      const data = await response.json();
      return this.formatMovieDetails(data);
    } catch (error) {
      console.error(`Erro ao buscar detalhes do filme ${id}:`, error);

      return this.findMovieInOfflineData(id);
    }
  },

  getTVShowDetails: async function (id) {
    try {
      const response = await fetch(
        `${this.baseUrl}/tv/${id}?api_key=${this.apiKey}&language=${this.language}&append_to_response=videos,credits`
      );
      const data = await response.json();
      return this.formatTVShowDetails(data);
    } catch (error) {
      console.error(`Erro ao buscar detalhes da série ${id}:`, error);

      return this.findMovieInOfflineData(id);
    }
  },

  formatMovies: function (movies) {
    return movies.map((movie, index) => ({
      id: movie.id,
      title: movie.title,
      type: "movie",
      backdrop: movie.backdrop_path
        ? `${this.imageBaseUrl}${this.backdropSize}${movie.backdrop_path}`
        : "assets/icons/User-Icon-Netflix.png",
      poster: movie.poster_path
        ? `${this.imageBaseUrl}${this.posterSize}${movie.poster_path}`
        : "assets/icons/User-Icon-Netflix.png",
      year: movie.release_date ? movie.release_date.substring(0, 4) : "",
      rating: this.getContentRating(movie.adult),
      duration: this.getRuntime(movie.runtime),
      description: movie.overview || "Descrição não disponível",
      match: `${Math.floor(movie.vote_average * 10)}% relevante`,
      genres: movie.genre_ids ? this.getGenreNames(movie.genre_ids) : [],
      cast: [],
      trailerUrl: "",
    }));
  },

  formatTVShows: function (shows) {
    return shows.map((show, index) => ({
      id: show.id,
      title: show.name,
      type: "tv",
      backdrop: show.backdrop_path
        ? `${this.imageBaseUrl}${this.backdropSize}${show.backdrop_path}`
        : "assets/icons/User-Icon-Netflix.png",
      poster: show.poster_path
        ? `${this.imageBaseUrl}${this.posterSize}${show.poster_path}`
        : "assets/icons/User-Icon-Netflix.png",
      year: show.first_air_date ? show.first_air_date.substring(0, 4) : "",
      rating: this.getContentRating(false),
      duration: `${show.number_of_seasons || "?"} Temporada${
        show.number_of_seasons !== 1 ? "s" : ""
      }`,
      description: show.overview || "Descrição não disponível",
      match: `${Math.floor(show.vote_average * 10)}% relevante`,
      genres: show.genre_ids ? this.getGenreNames(show.genre_ids) : [],
      cast: [],
      trailerUrl: "",
    }));
  },

  formatMovieDetails: function (movie) {
    let trailerUrl = "";
    if (
      movie.videos &&
      movie.videos.results &&
      movie.videos.results.length > 0
    ) {
      const trailer = movie.videos.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
      }
    }

    const cast =
      movie.credits && movie.credits.cast
        ? movie.credits.cast.slice(0, 5).map((actor) => actor.name)
        : [];

    const genres = movie.genres ? movie.genres.map((genre) => genre.name) : [];

    return {
      id: movie.id,
      title: movie.title,
      backdrop: movie.backdrop_path
        ? `${this.imageBaseUrl}${this.backdropSize}${movie.backdrop_path}`
        : "assets/images/placeholder-backdrop.jpg",
      poster: movie.poster_path
        ? `${this.imageBaseUrl}${this.posterSize}${movie.poster_path}`
        : "assets/images/placeholder-poster.jpg",
      year: movie.release_date ? movie.release_date.substring(0, 4) : "",
      rating: this.getContentRating(movie.adult),
      duration: this.getRuntime(movie.runtime),
      description: movie.overview || "Descrição não disponível",
      match: `${Math.floor(movie.vote_average * 10)}% relevante`,
      genres: genres,
      cast: cast,
      trailerUrl: trailerUrl,
    };
  },

  formatTVShowDetails: function (show) {
    let trailerUrl = "";
    if (show.videos && show.videos.results && show.videos.results.length > 0) {
      const trailer = show.videos.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
      }
    }

    const cast =
      show.credits && show.credits.cast
        ? show.credits.cast.slice(0, 5).map((actor) => actor.name)
        : [];

    const genres = show.genres ? show.genres.map((genre) => genre.name) : [];

    return {
      id: show.id,
      title: show.name,
      backdrop: show.backdrop_path
        ? `${this.imageBaseUrl}${this.backdropSize}${show.backdrop_path}`
        : "assets/images/placeholder-backdrop.jpg",
      poster: show.poster_path
        ? `${this.imageBaseUrl}${this.posterSize}${show.poster_path}`
        : "assets/images/placeholder-poster.jpg",
      year: show.first_air_date ? show.first_air_date.substring(0, 4) : "",
      rating: this.getContentRating(false),
      duration: `${show.number_of_seasons || "?"} Temporada${
        show.number_of_seasons !== 1 ? "s" : ""
      }`,
      description: show.overview || "Descrição não disponível",
      match: `${Math.floor(show.vote_average * 10)}% relevante`,
      genres: genres,
      cast: cast,
      trailerUrl: trailerUrl,
    };
  },

  getContentRating: function (isAdult) {
    return isAdult ? "18+" : "14+";
  },

  getRuntime: function (minutes) {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  },

  getGenreNames: function (genreIds) {
    const genreMap = {
      28: "Ação",
      12: "Aventura",
      16: "Animação",
      35: "Comédia",
      80: "Crime",
      99: "Documentário",
      18: "Drama",
      10751: "Família",
      14: "Fantasia",
      36: "História",
      27: "Terror",
      10402: "Música",
      9648: "Mistério",
      10749: "Romance",
      878: "Ficção Científica",
      10770: "Cinema TV",
      53: "Thriller",
      10752: "Guerra",
      37: "Faroeste",
    };

    return genreIds.map((id) => genreMap[id] || "Outro").filter((name) => name);
  },

  findMovieInOfflineData: function (id) {
    const offlineData = this.getOfflineMovies();
    const allMovies = [
      ...offlineData.popular,
      ...offlineData.trending,
      ...offlineData.action,
      ...offlineData.newReleases,
    ];

    return allMovies.find((movie) => movie.id === id) || null;
  },

  fetchMovies: async function () {
    try {
      const popular = await this.getPopularMovies();
      const trending = await this.getPopularTVShows();
      const action = await this.getActionMovies();
      const newReleases = await this.getNewReleases();
      const actionTV = await this.getActionTVShows();
      const dramaTV = await this.getDramaTVShows();

      return {
        popular,
        trending,
        action,
        newReleases,
        actionTV,
        dramaTV
      };
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);

      return this.getOfflineMovies();
    }
  },

  getOfflineMovies: function () {
    return {
      popular: [],
      trending: [],
      action: [],
      newReleases: [],
      actionTV: [],
      dramaTV: []
    };
  },

  searchMovies: async function (query) {
    if (!query || query.trim() === "") return [];

    try {
      const movieResponse = await fetch(
        `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=${
          this.language
        }&query=${encodeURIComponent(query)}&page=1`
      );
      const movieData = await movieResponse.json();
      const movies = this.formatMovies(movieData.results);

      const tvResponse = await fetch(
        `${this.baseUrl}/search/tv?api_key=${this.apiKey}&language=${
          this.language
        }&query=${encodeURIComponent(query)}&page=1`
      );
      const tvData = await tvResponse.json();
      const tvShows = this.formatTVShows(tvData.results);

      return [...movies, ...tvShows];
    } catch (error) {
      console.error("Erro ao buscar:", error);
      return [];
    }
  },
  
  getActionTVShows: async function () {
    try {
      const response = await fetch(
        `${this.baseUrl}/discover/tv?api_key=${this.apiKey}&language=${this.language}&with_genres=10759`
      );
      const data = await response.json();
      return this.formatTVShows(data.results);
    } catch (error) {
      console.error("Erro ao buscar séries de ação:", error);
      return [];
    }
  },

  getDramaTVShows: async function () {
    try {
      const response = await fetch(
        `${this.baseUrl}/discover/tv?api_key=${this.apiKey}&language=${this.language}&with_genres=18`
      );
      const data = await response.json();
      return this.formatTVShows(data.results);
    } catch (error) {
      console.error("Erro ao buscar séries de drama:", error);
      return [];
    }
  }
};
