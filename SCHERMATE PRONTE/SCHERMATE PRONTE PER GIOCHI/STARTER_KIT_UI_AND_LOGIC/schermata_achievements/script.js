// Attende che il documento HTML sia stato completamente caricato
document.addEventListener('DOMContentLoaded', () => {

    // Seleziona gli elementi del DOM con cui interagire
    const badgeGrid = document.getElementById('badge-grid');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCloseButton = document.getElementById('modal-close-button');
    const backButton = document.querySelector('.back-button');

    // URL del file di dati
    const dataUrl = 'achievements.json';

    // Funzione per caricare e visualizzare i badge
    async function loadAchievements() {
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const achievements = await response.json();

            badgeGrid.innerHTML = ''; // Svuota la griglia

            // Itera su ogni achievement e crea il suo elemento HTML
            achievements.forEach(achievement => {
                const badgeElement = document.createElement('div');
                badgeElement.classList.add('badge');

                // Logica di visualizzazione corretta
                if (achievement.sbloccato) {
                    // Se SBLOCCATO, crea immagine e testo completo
                    badgeElement.classList.add('unlocked');
                    badgeElement.innerHTML = `
                        <img src="${achievement.immagine}" alt="${achievement.nome}">
                        <p class="badge-name">${achievement.nome}</p>
                    `;
                    // Aggiunge l'evento click solo se il badge è sbloccato
                    badgeElement.addEventListener('click', () => {
                        showModal(achievement);
                    });
                } else {
                    // Se BLOCCATO, crea solo il testo '???' senza alcun tag <img>
                    badgeElement.classList.add('locked');
                    badgeElement.innerHTML = `<p class="badge-name">???</p>`;
                }

                // Aggiunge il badge creato alla griglia
                badgeGrid.appendChild(badgeElement);
            });

        } catch (error)
        {
            console.error("Errore nel caricamento degli achievements:", error);
            badgeGrid.innerHTML = `<p>Impossibile caricare gli achievements. Riprova più tardi.</p>`;
        }
    }

    // Funzione per mostrare la finestra modale
    function showModal(achievement) {
        modalImage.src = achievement.immagine;
        modalTitle.textContent = achievement.nome;
        modalDescription.textContent = achievement.descrizione;
        modalOverlay.style.display = 'flex';
    }

    // Funzione per nascondere la finestra modale
    function hideModal() {
        modalOverlay.style.display = 'none';
    }

    // Aggiunge gli eventi per chiudere la modale
    modalCloseButton.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            hideModal();
        }
    });

    // Aggiunge l'evento al pulsante "INDIETRO"
    backButton.addEventListener('click', () => {
        console.log("Torno alla schermata precedente...");
        window.history.back();
    });

    // Avvia il caricamento dei dati
    loadAchievements();
});