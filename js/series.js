let seriesData;

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    showLoading(true);

    try {
      if (typeof API === "undefined") {
        throw new Error(
          "API não está definida. Verifique se api.js foi carregado corretamente."
        );
      }

      API.fetchMovies().then(data => {
        seriesData = data;
        
        console.log("Dados recebidos:", seriesData);
        console.log("Séries de ação:", seriesData.actionTV);
        console.log("Séries de drama:", seriesData.dramaTV);

        renderGrid("popular-series", seriesData.trending);
        renderGrid("action-series", seriesData.actionTV);
        renderGrid("drama-series", seriesData.dramaTV);

        showLoading(false);
      }).catch(error => {
        console.error("Erro ao carregar séries:", error);
        showLoading(false);
      });
    } catch (error) {
      console.error("Erro ao carregar séries:", error);
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