document.addEventListener('DOMContentLoaded', async () => {
    // Aguardar o carregamento dos componentes
    setTimeout(async () => {
        showLoading(true);
        
        try {
            // Carregar itens da lista do localStorage
            const myList = getMyList();
            
            // Mostrar mensagem de lista vazia ou renderizar itens
            if (myList.length === 0) {
                document.getElementById('empty-list-message').style.display = 'flex';
            } else {
                document.getElementById('empty-list-message').style.display = 'none';
                renderMyList(myList);
            }
            
        } catch (error) {
            console.error("Erro ao carregar minha lista:", error);
        } finally {
            showLoading(false);
        }
    }, 500);
});

function getMyList() {
    const savedList = localStorage.getItem('netflix_my_list');
    return savedList ? JSON.parse(savedList) : [];
}

function renderMyList(items) {
    const container = document.getElementById('my-list-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.dataset.movieId = item.id;
        
        card.innerHTML = `
            <img src="${item.poster}" alt="${item.title}">
            <div class="card-info">
                <h3 class="card-title">${item.title}</h3>
                <button class="remove-from-list" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        card.addEventListener('click', async (e) => {
            if (!e.target.closest('.remove-from-list')) {
                await openMovieModal(item.id);
            }
        });
        
        container.appendChild(card);
    });
    
    // Adicionar evento para remover itens da lista
    document.querySelectorAll('.remove-from-list').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemId = parseInt(button.dataset.id);
            removeFromMyList(itemId);
        });
    });
}

function removeFromMyList(itemId) {
    let myList = getMyList();
    myList = myList.filter(item => item.id !== itemId);
    localStorage.setItem('netflix_my_list', JSON.stringify(myList));
    
    // Atualizar a exibição
    if (myList.length === 0) {
        document.getElementById('empty-list-message').style.display = 'flex';
    }
    
    renderMyList(myList);
}