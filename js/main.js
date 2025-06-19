let movieSliders;
let movieModal;
let modalClose;
let navbar;
let searchIcon;
let searchInputContainer;
let searchInput;
let searchResults = null;
let searchTimeout = null;
let moviesData;

function setupProfileModal() {
  const profileIcon = document.getElementById("profileIcon");
  const profileModal = document.getElementById("profileModal");

  if (!profileIcon || !profileModal) return;

  profileIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleProfileModal();
  });

  document.addEventListener("click", function (e) {
    if (!profileModal.contains(e.target) && e.target !== profileIcon) {
      closeProfileModal();
    }
  });
}

function toggleProfileModal() {
  const profileIcon = document.getElementById("profileIcon");
  const profileModal = document.getElementById("profileModal");

  if (profileModal.style.display === "block") {
    closeProfileModal();
  } else {
    profileIcon.classList.add("active");
    profileModal.style.display = "block";
  }
}

function closeProfileModal() {
  const profileIcon = document.getElementById("profileIcon");
  const profileModal = document.getElementById("profileModal");

  profileIcon.classList.remove("active");
  profileModal.style.display = "none";
}

function initApp() {
  console.log("Inicializando aplicação...");

  movieSliders = document.querySelectorAll(".movie-slider");
  movieModal = document.getElementById("movieModal");
  modalClose = document.querySelector(".modal-close");
  navbar = document.querySelector(".navbar");
  searchIcon = document.querySelector(".search-icon");
  searchInputContainer = document.querySelector(".search-input-container");
  searchInput = document.querySelector(".search-input");

  setupProfileModal();

  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname.includes("index.html");

  if (isHomePage) {
    initializeData();
  } else {
    setupCommonEventListeners();
  }
}

function setupCommonEventListeners() {
  if (!navbar || !searchIcon || !searchInput) {
    console.error(
      "Elementos DOM não inicializados. Não é possível configurar event listeners comuns."
    );
    return;
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  if (searchIcon) {
    searchIcon.addEventListener("click", function () {
      searchInputContainer.classList.toggle("active");
      searchInput.focus();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
  }

  document.addEventListener("click", function (e) {
    if (
      !searchInputContainer.contains(e.target) &&
      !searchIcon.contains(e.target)
    ) {
      closeSearch();
    }
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeMovieModal);
  }
}

async function initializeData() {
  showLoading(true);

  try {
    if (typeof API === "undefined") {
      throw new Error(
        "API não está definida. Verifique se api.js foi carregado corretamente."
      );
    }

    moviesData = await API.fetchMovies();

    renderMovies("Populares na Netflix", moviesData.popular, 0);
    renderMovies("Séries Populares", moviesData.trending, 1);
    renderMovies("Filmes de Ação", moviesData.action, 2);
    renderMovies("Lançamentos", moviesData.newReleases, 3);

    setupEventListeners();
  } catch (error) {
    console.error("Erro ao inicializar a aplicação:", error);
  } finally {
    showLoading(false);
  }
}

function showLoading(show) {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = show ? "flex" : "none";
  }
}

function renderMovies(sectionTitle, movies, sectionIndex) {
  if (!movieSliders || movieSliders.length <= sectionIndex) {
    console.error(`Slider para seção ${sectionIndex} não encontrado`);
    return;
  }

  const movieSlider = movieSliders[sectionIndex];
  movieSlider.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.dataset.movieId = movie.id;

    movieCard.innerHTML = `
            <img src="${movie.backdrop}" alt="${movie.title}">
            <div class="card-info">
                <h3 class="card-title">${movie.title}</h3>
            </div>
        `;

    movieSlider.appendChild(movieCard);
  });
}

function setupEventListeners() {
  if (
    !movieSliders ||
    !movieModal ||
    !modalClose ||
    !navbar ||
    !searchIcon ||
    !searchInput
  ) {
    console.error(
      "Elementos DOM não inicializados. Não é possível configurar event listeners."
    );
    return;
  }

  document.querySelectorAll(".handle").forEach((button) => {
    button.addEventListener("click", function () {
      const slider = this.closest(".movie-row").querySelector(".movie-slider");
      const sliderIndex = this.classList.contains("left-handle") ? -1 : 1;
      const cardWidth = slider.querySelector(".movie-card").offsetWidth + 10;

      slider.scrollBy({
        left: cardWidth * sliderIndex * 4,
        behavior: "smooth",
      });
    });
  });

  document.querySelectorAll(".movie-slider").forEach((slider) => {
    slider.addEventListener("click", async function (e) {
      const movieCard = e.target.closest(".movie-card");
      if (movieCard) {
        const movieId = parseInt(movieCard.dataset.movieId);
        await openMovieModal(movieId);
      }
    });
  });

  modalClose.addEventListener("click", closeMovieModal);
  movieModal.addEventListener("click", function (e) {
    if (e.target === movieModal) {
      closeMovieModal();
    }
  });

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  searchIcon.addEventListener("click", toggleSearch);
  searchInput.addEventListener("input", handleSearchInput);

  document.addEventListener("click", function (e) {
    if (
      !e.target.closest(".search-container") &&
      !e.target.closest(".search-results")
    ) {
      closeSearch();
    }
  });
}

async function openMovieModal(movieId) {
  const modalContent = document.querySelector(".modal-content");
  if (!modalContent) {
    console.error("Elemento .modal-content não encontrado");
    return;
  }

  modalContent.innerHTML = '<div class="loading">Carregando...</div>';
  movieModal.style.display = "block";

  try {
    let selectedMovie;

    const isMovie = true;

    if (isMovie) {
      selectedMovie = await API.getMovieDetails(movieId);
    } else {
      selectedMovie = await API.getTVShowDetails(movieId);
    }

    if (!selectedMovie) {
      const allCategories = ["popular", "trending", "action", "newReleases"];

      for (const category of allCategories) {
        const found = moviesData[category].find(
          (movie) => movie.id === movieId
        );
        if (found) {
          selectedMovie = found;
          break;
        }
      }
    }

    if (!selectedMovie) {
      throw new Error("Filme não encontrado");
    }

    modalContent.innerHTML = `
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <div class="modal-banner">
                <img src="${selectedMovie.poster}" alt="${
      selectedMovie.title
    }" class="modal-img">
                <div class="modal-banner-content">
                    <h2 class="modal-title">${selectedMovie.title}</h2>
                    <div class="modal-buttons">
                        <button class="btn btn-play"><i class="fas fa-play"></i> Assistir</button>
                        <button class="btn btn-trailer" id="scroll-to-trailer"><i class="fas fa-film"></i> Trailer</button>
                        <button class="btn btn-list"><i class="fas fa-plus"></i></button>
                        <button class="btn btn-like"><i class="far fa-thumbs-up"></i></button>
                    </div>
                </div>
            </div>
            <div class="modal-info">
                <div class="modal-details">
                    <div class="modal-metadata">
                        <span class="match">${selectedMovie.match}</span>
                        <span class="year">${selectedMovie.year}</span>
                        <span class="rating">${selectedMovie.rating}</span>
                        <span class="duration">${selectedMovie.duration}</span>
                    </div>
                    <p class="modal-description">${
                      selectedMovie.description
                    }</p>
                </div>
                <div class="modal-extra">
                    <div class="modal-cast">
                        <span class="label">Elenco:</span>
                        <span class="cast-list">${selectedMovie.cast.join(
                          ", "
                        )}</span>
                    </div>
                    <div class="modal-genres">
                        <span class="label">Gêneros:</span>
                        <span class="genre-list">${selectedMovie.genres.join(
                          ", "
                        )}</span>
                    </div>
                </div>
            </div>
            <div class="modal-trailer">
                <h3>Trailer</h3>
                <div class="trailer-container" id="trailer-container">
                    ${
                      selectedMovie.trailerUrl
                        ? `
                        <div class="trailer-player" id="trailer-player">
                            <img src="${selectedMovie.backdrop}" class="trailer-thumbnail" alt="${selectedMovie.title} Trailer Thumbnail">
                            <button class="trailer-play-button" id="play-trailer"><i class="fas fa-play"></i></button>
                        </div>
                    `
                        : '<div class="trailer-unavailable"><p>Trailer não disponível</p></div>'
                    }
                </div>
            </div>
        `;

    document
      .querySelector(".modal-close")
      .addEventListener("click", closeMovieModal);

    if (selectedMovie.trailerUrl) {
      const scrollToTrailerBtn = document.getElementById("scroll-to-trailer");
      if (scrollToTrailerBtn) {
        scrollToTrailerBtn.addEventListener("click", function () {
          document
            .querySelector(".modal-trailer")
            .scrollIntoView({ behavior: "smooth" });
        });
      }

      const playTrailerBtn = document.getElementById("play-trailer");
      if (playTrailerBtn) {
        playTrailerBtn.addEventListener("click", function () {
          const trailerContainer = document.getElementById("trailer-container");
          trailerContainer.innerHTML = `
                        <iframe 
                            src="${selectedMovie.trailerUrl}?autoplay=1" 
                            title="${selectedMovie.title} Trailer" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    `;
        });
      }
    }
  } catch (error) {
    console.error("Erro ao abrir modal:", error);
    modalContent.innerHTML =
      '<div class="error">Erro ao carregar detalhes do filme</div>';
  }

  document.body.style.overflow = "hidden";
}

function closeMovieModal() {
  if (!movieModal) return;

  movieModal.style.display = "none";
  document.body.style.overflow = "auto";

  const trailerContainer = document.querySelector(".trailer-container");
  if (trailerContainer) {
    trailerContainer.innerHTML = "";
  }
}

function toggleSearch() {
  searchInputContainer.classList.toggle("active");
  if (searchInputContainer.classList.contains("active")) {
    searchInput.focus();
  } else {
    closeSearchResults();
  }
}

function closeSearch() {
  searchInputContainer.classList.remove("active");
  closeSearchResults();
}

function handleSearchInput() {
  const query = searchInput.value.trim().toLowerCase();

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  if (query.length < 2) {
    closeSearchResults();
    return;
  }

  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, 500);
}

function closeSearchResults() {
  if (searchResults) {
    searchResults.remove();
    searchResults = null;
  }
}

function performSearch(query) {
  closeSearchResults();

  searchResults = document.createElement("div");
  searchResults.classList.add("search-results");
  searchResults.classList.add("active");
  searchResults.style.display = "block";

  document.body.appendChild(searchResults);

  const searchRect = searchInputContainer.getBoundingClientRect();
  searchResults.style.position = "absolute";
  searchResults.style.top = searchRect.bottom + window.scrollY + "px";
  searchResults.style.right = window.innerWidth - searchRect.right + "px";

  const currentPage = getCurrentPage();
  let results = [];

  if (currentPage === "index") {
    if (!moviesData) return;

    results = [
      ...searchInCategory(moviesData.popular, query),
      ...searchInCategory(moviesData.trending, query),
      ...searchInCategory(moviesData.action, query),
      ...searchInCategory(moviesData.newReleases, query),
    ];
  } else if (currentPage === "series") {
    const seriesData = getSeriesData();
    if (!seriesData) return;

    results = [
      ...searchInCategory(seriesData.trending, query),
      ...searchInCategory(
        seriesData.action.filter((item) => item.type === "tv"),
        query
      ),
      ...searchInCategory(
        seriesData.popular.filter((item) => item.type === "tv"),
        query
      ),
    ];
  } else if (currentPage === "filmes") {
    const moviesPageData = getMoviesPageData();
    if (!moviesPageData) return;

    results = [
      ...searchInCategory(moviesPageData.popular, query),
      ...searchInCategory(moviesPageData.action, query),
      ...searchInCategory(moviesPageData.newReleases, query),
    ];
  } else if (currentPage === "minha-lista") {
    const myList = getMyList();
    results = searchInCategory(myList, query);
  }

  results = removeDuplicates(results);

  if (results.length === 0) {
    searchResults.innerHTML =
      '<div class="no-results">Nenhum resultado encontrado</div>';
  } else {
    results = results.slice(0, 6);

    results.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("search-result-item");
      resultItem.dataset.movieId = item.id;

      resultItem.innerHTML = `
        <img src="${item.poster}" alt="${item.title}">
        <div class="result-info">
          <h4>${item.title}</h4>
          <p>${item.year || ""}</p>
        </div>
      `;

      resultItem.addEventListener("click", async () => {
        closeSearch();
        await openMovieModal(item.id);
      });

      searchResults.appendChild(resultItem);
    });
  }
}

function searchInCategory(items, query) {
  if (!items || !Array.isArray(items)) return [];

  return items.filter((item) => {
    const title = item.title ? item.title.toLowerCase() : "";
    const description = item.description ? item.description.toLowerCase() : "";
    const genres = Array.isArray(item.genres)
      ? item.genres.join(" ").toLowerCase()
      : "";

    return (
      title.includes(query) ||
      description.includes(query) ||
      genres.includes(query)
    );
  });
}

function removeDuplicates(results) {
  const uniqueIds = {};
  return results.filter((item) => {
    if (uniqueIds[item.id]) {
      return false;
    }
    uniqueIds[item.id] = true;
    return true;
  });
}

function getCurrentPage() {
  const path = window.location.pathname;

  if (path.includes("series.html")) {
    return "series";
  } else if (path.includes("filmes.html")) {
    return "filmes";
  } else if (path.includes("minha-lista.html")) {
    return "minha-lista";
  } else {
    return "index";
  }
}

function getSeriesData() {
  if (typeof seriesData !== "undefined") {
    return seriesData;
  }

  if (typeof API !== "undefined") {
    return API.fetchMovies();
  }

  return null;
}

function getMoviesPageData() {
  if (typeof moviesPageData !== "undefined") {
    return moviesPageData;
  }

  if (typeof API !== "undefined") {
    return API.fetchMovies();
  }

  return null;
}

function getMyList() {
  const savedList = localStorage.getItem("netflix_my_list");
  return savedList ? JSON.parse(savedList) : [];
}
