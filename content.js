// Função principal para esconder elementos relacionados ao Shorts
function hideShorts() {
    // 1. Ocultar carrosseis de Shorts na página inicial
    const shelves = document.querySelectorAll('ytd-rich-shelf-renderer, ytd-reel-shelf-renderer');
    shelves.forEach(shelf => {
        // Verifica atributos diretos
        if (shelf.hasAttribute('is-shorts') || shelf.tagName.toLowerCase() === 'ytd-reel-shelf-renderer') {
            shelf.style.setProperty('display', 'none', 'important');
            return;
        }
        
        // Verifica se há vídeos com link de shorts dentro do carrossel (garante precisão)
        const shortLink = shelf.querySelector('a[href^="/shorts/"]');
        if (shortLink) {
            shelf.style.setProperty('display', 'none', 'important');
        }
    });

    // 2. Ocultar itens de navegação (menu hambúrguer)
    const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer a[href^="/shorts"], ytd-mini-guide-entry-renderer a[href^="/shorts"]');
    guideEntries.forEach(entry => {
        const parent = entry.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
        if (parent) parent.style.setProperty('display', 'none', 'important');
    });

    // 3. Ocultar itens individuais de Shorts (ex: resultados de busca)
    const relatedShorts = document.querySelectorAll('ytd-reel-item-renderer, ytd-video-renderer[is-reel]');
    relatedShorts.forEach(short => {
        short.style.setProperty('display', 'none', 'important');
    });
}

// Configura o MutationObserver para ser notificado sempre que o DOM for alterado dinamicamente
const observer = new MutationObserver(() => {
    hideShorts();
});

// Inicia a observação no documento inteiro
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

// Executa na primeira carga
hideShorts();
