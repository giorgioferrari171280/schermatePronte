document.addEventListener('DOMContentLoaded', () => {

    // Memorizza i riferimenti ai 4 pulsanti di azione principali.
    let buttons = [
        document.getElementById('btn1'),
        document.getElementById('btn2'),
        document.getElementById('btn3'),
        document.getElementById('btn4')
    ];

    /**
     * Carica e visualizza i dati per una specifica schermata.
     * @param {string} screenId L'ID della schermata da caricare (es. 'schermata_1').
     */
    const loadScreen = async (screenId) => {
        try {
            // Carica il file JSON con i dati di gioco.
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            
            const gameData = await response.json();
            const screenData = gameData[screenId];

            if (screenData) {
                // Popola l'header, l'immagine e la narrativa.
                document.getElementById('screen-title').textContent = screenData.titolo_schermata;
                document.getElementById('screen-image').src = screenData.path_immagine;
                document.getElementById('narrative-text').textContent = screenData.testo_narrativo;

                // Gestisce la logica dinamica per i pulsanti.
                screenData.pulsanti.forEach((pulsanteInfo, index) => {
                    if (buttons[index]) {
                        const currentButton = buttons[index];
                        
                        // Imposta il testo del pulsante.
                        currentButton.textContent = pulsanteInfo.testo;

                        // Per evitare di accumulare vecchi eventi, "cloniamo" il pulsante.
                        // Questo è il modo più semplice per rimuovere tutti gli event listener precedenti.
                        const newButton = currentButton.cloneNode(true);
                        currentButton.parentNode.replaceChild(newButton, currentButton);

                        // Aggiungiamo il nuovo event listener che carica la schermata successiva al click.
                        newButton.addEventListener('click', () => {
                            loadScreen(pulsanteInfo.prossima_schermata);
                        });
                        
                        // Aggiorniamo il nostro array di riferimento con il nuovo pulsante "pulito".
                        buttons[index] = newButton;
                    }
                });

            } else {
                console.error(`Dati non trovati per l'ID schermata: ${screenId}`);
                document.getElementById('narrative-text').textContent = `ERRORE: Schermata con ID "${screenId}" non trovata nel file data.json.`;
            }
        } catch (error) {
            console.error("Impossibile caricare i dati di gioco:", error);
            document.getElementById('narrative-text').textContent = "ERRORE CRITICO: Impossibile caricare o leggere il file data.json. Controlla la console del browser (F12) per i dettagli.";
        }
    };

    // Carica la schermata iniziale al caricamento della pagina.
    loadScreen('schermata_1');
});