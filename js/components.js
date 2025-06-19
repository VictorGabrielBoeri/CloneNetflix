async function loadComponent(containerId, componentPath, replacements = {}) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Erro ao carregar o componente: ${response.status}`);
    }

    let html = await response.text();

    for (const [key, value] of Object.entries(replacements)) {
      html = html.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    }

    document.getElementById(containerId).innerHTML = html;
  } catch (error) {
    console.error(`Erro ao carregar componente para ${containerId}:`, error);
  }
}

// Carregar todos os componentes quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    // Carregar a barra de navegação
    await loadComponent('navbar-container', 'components/navbar.html');
    
    // Verificar qual página está ativa e destacar o link correspondente
    highlightActiveNavLink();
    
    // Se estiver na página inicial, carregar o banner principal
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        await loadComponent('hero-banner-container', 'components/hero-banner.html');
        
        // Carregar as seções de filmes para a página inicial
        await loadComponent('popular-section-container', 'components/movie-section.html', {
            SECTION_TITLE: 'Populares na Netflix',
            SECTION_ID: 'popular-movies'
        });
        
        await loadComponent('continue-watching-container', 'components/movie-section.html', {
            SECTION_TITLE: 'Continuar Assistindo',
            SECTION_ID: 'continue-watching'
        });
        
        await loadComponent('action-series-container', 'components/movie-section.html', {
            SECTION_TITLE: 'Séries de Ação',
            SECTION_ID: 'action-series'
        });
        
        await loadComponent('new-releases-container', 'components/movie-section.html', {
            SECTION_TITLE: 'Lançamentos',
            SECTION_ID: 'new-releases'
        });
    }
    
    // Carregar o modal de detalhes do filme
    await loadComponent('movie-modal-container', 'components/movie-modal.html');
    
    // Carregar o modal de perfil
    await loadComponent('profile-modal-container', 'components/profile-modal.html');
    
    // Inicializar o aplicativo após carregar todos os componentes
    if (typeof initApp === 'function') {
        initApp();
    }
});

// Função para destacar o link de navegação ativo
function highlightActiveNavLink() {
    setTimeout(() => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const page = link.getAttribute('data-page');
            if (currentPath.includes(page) || 
                (page === 'home' && (currentPath === '/' || currentPath.includes('index.html')))) {
                link.classList.add('active');
            }
        });
    }, 100); // Pequeno atraso para garantir que os links foram carregados
}
