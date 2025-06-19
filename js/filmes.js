let moviesPageData;

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(async () => {
    showLoading(true);

    try {
      if (typeof API === "undefined") {
        throw new Error(
          "API não está definida. Verifique se api.js foi carregado corretamente."
        );
      }

      moviesPageData = await API.fetchMovies();

      renderGrid("popular-movies", moviesPageData.popular);
      renderGrid("action-movies", moviesPageData.action);
      renderGrid("new-releases", moviesPageData.newReleases);
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
    } finally {
      showLoading(false);
    }
  }, 500);
});

function renderGrid(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.dataset.movieId = item.id;

    card.innerHTML = `
            <img src="${item.poster}" alt="${item.title}">
            <div class="card-info">
                <h3 class="card-title">${item.title}</h3>
            </div>
        `;

    card.addEventListener("click", async () => {
      await openMovieModal(item.id);
    });

    container.appendChild(card);
  });
}
