document.addEventListener('DOMContentLoaded', async () => {
    
    // Seleziona tutti gli elementi del DOM che devono essere aggiornati
    const titleElement = document.getElementById('screen-title-box');
    const narrativeElement = document.getElementById('narrative-text');
    const imageElement = document.getElementById('scene-image');
    const videoElement = document.getElementById('scene-video');
    const choiceButtonsContainer = document.getElementById('choice-buttons');
    
    let gameData = {}; // Questo oggetto conterrà i dati caricati dal file JSON

    // Carica i dati delle scene dal file esterno
    try {
        const response = await fetch('scenes.json');
        if (!response.ok) {
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }
        gameData = await response.json();
    } catch (error) {
        console.error("Errore fatale: impossibile caricare il file scenes.json.", error);
        document.body.innerHTML = `<div style="color: white; padding: 20px;">Errore: Impossibile caricare i dati del gioco. Controlla la console per i dettagli.</div>`;
        return; // Interrompe l'esecuzione se i dati non possono essere caricati
    }

    /**
     * Funzione principale per caricare e visualizzare una scena
     * @param {number} screenId L'ID della scena da caricare
     */
    function loadScreen(screenId) {
        const screenData = gameData[screenId];

        if (!screenData) {
            console.error(`Dati non trovati per la schermata con ID ${screenId}!`);
            return;
        }

        // Aggiorna titolo e testo narrativo
        titleElement.textContent = screenData.titolo_schermata;
        narrativeElement.textContent = screenData.narrativa;

        // Controlla il tipo di media e mostra l'elemento corretto
        if (screenData.media_type === 'video') {
            imageElement.style.display = 'none'; // Nasconde l'immagine
            videoElement.style.display = 'block'; // Mostra il video
            
            // Aggiorna la fonte del video solo se è cambiata
            const sourceElement = videoElement.querySelector('source');
            if (sourceElement.src !== screenData.path_media) {
                sourceElement.src = screenData.path_media;
                videoElement.load(); // Dice al video di caricare la nuova fonte
                videoElement.play().catch(e => console.log("La riproduzione automatica è stata bloccata dal browser."));
            }
        } else { // Altrimenti, si assume sia un'immagine
            videoElement.style.display = 'none'; // Nasconde il video
            imageElement.style.display = 'block'; // Mostra l'immagine
            imageElement.src = screenData.path_media;
            imageElement.alt = screenData.titolo_schermata;
        }

        // Pulisce e ricrea i pulsanti delle scelte
        choiceButtonsContainer.innerHTML = '';
        if (screenData.scelte) {
            screenData.scelte.forEach(scelta => {
                const button = document.createElement('button');
                button.className = 'choice-button';
                button.textContent = scelta.testo;
                
                button.addEventListener('click', () => {
                    loadScreen(scelta.destinazione);
                });
                
                choiceButtonsContainer.appendChild(button);
            });
        }
    }

    // Aggiunge la logica ai pulsanti del menu principale
    document.getElementById('btn-character').addEventListener('click', () => alert('Schermata PERSONAGGIO non implementata.'));
    document.getElementById('btn-influence').addEventListener('click', () => alert('Schermata INFLUENZA non implementata.'));
    document.getElementById('btn-home').addEventListener('click', () => loadScreen(1));
    document.getElementById('btn-options').addEventListener('click', () => alert('Schermata OPZIONI non implementata.'));

    // Avvia il gioco caricando la prima schermata
    loadScreen(1);
});