document.addEventListener('DOMContentLoaded', () => {

    const cutsceneImage = document.getElementById('cutscene-image');
    const narrativeText = document.getElementById('narrative-text');
    const continueButton = document.getElementById('continue-button');

    // Chiave univoca per tutti i salvataggi del nostro gioco
    const SAVE_GAME_KEY = 'mioGiocoSalvataggiMultipli';
    let currentSlotId = 'slot1'; // Lo slot che stiamo usando attualmente

    let currentChapterData = [];
    let currentState = {}; // Contiene lo stato dello slot attualmente caricato

    // Carica un file di dati specifico (es. "capitolo1.json")
    async function loadChapterFile(fileName) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) throw new Error(`File non trovato: ${fileName}`);
            currentChapterData = await response.json();
        } catch (error) {
            console.error("Errore nel caricamento del file di capitolo:", error);
            narrativeText.textContent = `Errore critico: impossibile caricare ${fileName}.`;
        }
    }

    // Mostra una schermata specifica dall'array di dati attualmente caricato
    function displayScreenById(id) {
        const screenToShow = currentChapterData.find(screen => screen.id === id);
        if (screenToShow) {
            narrativeText.textContent = screenToShow.text;
            cutsceneImage.style.backgroundImage = `url('${screenToShow.image}')`;
            currentState.schermata_corrente_id = screenToShow.id;
            continueButton.disabled = !screenToShow.next_screen;
            continueButton.textContent = "CONTINUA";
        } else {
            narrativeText.textContent = `ID schermata non trovato: ${id}`;
            continueButton.disabled = true;
        }
    }

    // ▼▼▼ SALVATAGGIO REALE NELLO SLOT CORRETTO ▼▼▼
    function saveGameState(stateToSave) {
        // 1. Leggi tutti i salvataggi esistenti
        const allSavesJSON = localStorage.getItem(SAVE_GAME_KEY);
        let allSaves = allSavesJSON ? JSON.parse(allSavesJSON) : { slot1: null, slot2: null, slot3: null };

        // 2. Aggiorna solo lo slot che stiamo usando
        allSaves[currentSlotId] = stateToSave;

        // 3. Salva di nuovo l'intero oggetto dei salvataggi
        localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(allSaves));
        console.log(`Stato salvato nello ${currentSlotId}!`, stateToSave);
    }

    // Gestore del click per avanzare
    continueButton.addEventListener('click', async () => {
        const currentScreen = currentChapterData.find(screen => screen.id === currentState.schermata_corrente_id);
        if (!currentScreen || !currentScreen.next_screen) return;

        const next = currentScreen.next_screen;
        const nextFile = next.file || currentState.file_corrente;
        const nextId = next.id;

        // Crea il nuovo stato da salvare, includendo nome e data
        const newState = {
            ...currentState, // Mantiene i dati vecchi come il nome del giocatore
            file_corrente: nextFile,
            schermata_corrente_id: nextId,
            data_salvataggio: new Date().toISOString() // Aggiunge data e ora del salvataggio
        };
        
        saveGameState(newState);

        if (next.file && next.file !== currentState.file_corrente) {
            await loadChapterFile(next.file);
        }
        
        currentState.file_corrente = nextFile; // Aggiorna lo stato in memoria
        displayScreenById(next.id);
    });

    // Funzione principale che avvia tutto
    async function initGame() {
        // In un gioco completo, qui mostreresti una schermata per far scegliere all'utente
        // quale slot caricare o se iniziare una nuova partita.
        // Per questo esempio, carichiamo di default lo 'slot1'.
        
        const allSavesJSON = localStorage.getItem(SAVE_GAME_KEY);
        const allSaves = allSavesJSON ? JSON.parse(allSavesJSON) : {};

        if (allSaves[currentSlotId]) {
            // Se esiste un salvataggio per questo slot, lo carichiamo
            currentState = allSaves[currentSlotId];
            console.log(`Salvataggio trovato per ${currentSlotId}!`, currentState);
        } else {
            // Altrimenti, creiamo uno stato iniziale per una nuova partita
            currentState = {
                nome_giocatore: "Nuovo Giocatore", // Potresti chiederlo all'inizio
                file_corrente: "capitolo1.json",
                schermata_corrente_id: "c1_scena_iniziale",
                data_salvataggio: new Date().toISOString()
            };
            console.log(`Nessun salvataggio per ${currentSlotId}, inizio nuova partita.`);
            saveGameState(currentState); // Salva subito lo stato iniziale
        }
        
        await loadChapterFile(currentState.file_corrente);
        displayScreenById(currentState.schermata_corrente_id);
    }

    initGame();
});