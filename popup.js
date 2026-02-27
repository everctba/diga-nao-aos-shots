document.addEventListener('DOMContentLoaded', () => {
    const toggleCheckbox = document.getElementById('toggleShorts');

    // Lê o estado atual
    chrome.storage.local.get({ enableBlocking: true }, (result) => {
        // Validação básica simulando a checagem que faríamos com Zod
        if (typeof result.enableBlocking === 'boolean') {
            toggleCheckbox.checked = result.enableBlocking;
        } else {
            toggleCheckbox.checked = true; // Fallback garantidor
        }
    });

    // Salva o estado ao alterar o switch (Block)
    toggleCheckbox.addEventListener('change', () => {
        chrome.storage.local.set({ enableBlocking: toggleCheckbox.checked });
    });
});
