let isBlockingEnabled = true;

// Função principal para manipular a visibilidade dos elementos
function processShorts() {
    // 1. Carrosséis de Shorts na página inicial
    const shelves = document.querySelectorAll('ytd-rich-shelf-renderer, ytd-reel-shelf-renderer');
    shelves.forEach(shelf => {
        let isShortsShelf = shelf.hasAttribute('is-shorts') || shelf.tagName.toLowerCase() === 'ytd-reel-shelf-renderer';

        // Se ainda não for obvio pela marcação superior, verificamos os links internos
        if (!isShortsShelf) {
            const shortLink = shelf.querySelector('a[href^="/shorts/"]');
            if (shortLink) isShortsShelf = true;
        }

        if (isShortsShelf) {
            applyRuleToElement(shelf);
        }
    });

    // 2. Itens de navegação (menu hambúrguer esquerdo)
    const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer a[href^="/shorts"], ytd-mini-guide-entry-renderer a[href^="/shorts"]');
    guideEntries.forEach(entry => {
        const parent = entry.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
        if (parent) applyRuleToElement(parent);
    });

    // 3. Itens individuais de Shorts (resultados de busca, sidebar, etc)
    const relatedShorts = document.querySelectorAll('ytd-reel-item-renderer, ytd-video-renderer[is-reel]');
    relatedShorts.forEach(short => {
        applyRuleToElement(short);
    });
}

// Aplica Display None (se bloquear)
function applyRuleToElement(element) {
    if (isBlockingEnabled) {
        element.style.setProperty('display', 'none', 'important');
    } else {
        // Nem debug, nem bloqueado: limpa display
        if (element.style.display === 'none') {
            element.style.removeProperty('display');
        }
    }
}

// Instância o observador para a checagem em background
const observer = new MutationObserver(() => {
    // Precisamos sempre rodar, porque mesmo em standby, novos elementos carregados via scroll
    // ainda precisam ser escondidos.
    if (isBlockingEnabled) {
        processShorts();
    }
});

function initObserver() {
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

// ======= Carga Inicial e Sincronização de Estado ======= 

// Lê do banco local antes de rodar a primeira vez
chrome.storage.local.get({ enableBlocking: true }, (result) => {
    if (typeof result.enableBlocking === 'boolean') {
        isBlockingEnabled = result.enableBlocking;
    }

    initObserver();
    processShorts(); // Executar uma vez no carregamento
});

// Escuta mudanças feitas assicronamente no Popup
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.enableBlocking !== undefined) {
        const newValue = changes.enableBlocking.newValue;
        if (typeof newValue === 'boolean') {
            isBlockingEnabled = newValue;
            processShorts(); // Re-processar com o novo estado
        }
    }
});
