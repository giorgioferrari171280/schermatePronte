document.addEventListener('DOMContentLoaded', () => {

    // --- DATI DI GIOCO ---
    let allLocationData = {};

    // Funzione per convertire risorse in formato display
    function getRisorseDisplay() {
        return Object.entries(gameState.playerResources).map(([nome, quantita]) => ({
            nome,
            quantita
        }));
    }

    const mockPlayerStats = {
        attributi: [
            { nome: 'Forza', valore: 8 }, { nome: 'Destrezza', valore: 12 },
            { nome: 'Costituzione', valore: 9 }, { nome: 'Intelligenza', valore: 15 },
            { nome: 'Percezione', valore: 13 }, { nome: 'Carisma', valore: 10 },
        ]
    };
    
    // NUOVI DATI PER LE FAZIONI
    const mockFactionScores = {
        fazioni: [
            { nome: 'Gilda Mercanti', punteggio: 45 }, { nome: 'Collettivo Ha-Do', punteggio: -10 },
            { nome: 'Enclave Scientifica', punteggio: 15 }, { nome: 'Culto Cromato', punteggio: 0 },
            { nome: 'Sicurezza Zenith', punteggio: -5 }, { nome: 'Nomadi Digitali', punteggio: 25 },
        ]
    };

    // --- STATO DEL GIOCO ---
    let gameState = { 
        currentLocationId: 'dock_07', 
        actionChosen: false,
        moveMode: false, // Modalità movimento attivata
        playerFlags: new Set(), // Set per gestire i flag delle azioni completate
        actionClickCount: {}, // Contatore per i click delle azioni
        playerResources: {
            'Crediti': 1570,
            'Chip Dati': 5,
            'Componenti': 23,
            'Med-Kit': 2,
            'Scudo Energia': 1,
            'Munizioni': 50
        }
    };

    // --- SELETTORI DOM ---
    const locationNameEl = document.getElementById('location-name');
    const narrativeTextEl = document.getElementById('narrative-text');
    const locationImageEl = document.getElementById('location-image');
    const resourcesContentEl = document.querySelector('#resources-area');
    const playerStatsContentEl = document.querySelector('#player-stats-area');
    const factionScoresContentEl = document.querySelector('#faction-scores-area');
    const actionButtonsEl = document.getElementById('action-buttons');
    const navPadEl = document.getElementById('nav-pad');
    const navButtons = navPadEl.querySelectorAll('.nav-btn');
    const moveBtnEl = document.getElementById('move-btn');

    // --- FUNZIONI PRINCIPALI ---
    function populateDataBox(element, dataList, valueKey) {
        element.innerHTML = '';
        dataList.forEach(data => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `<span>${data.nome}</span> <span>${data[valueKey]}</span>`;
            element.appendChild(item);
        });
    }

    function updateNavButtonsState() {
        navButtons.forEach(btn => { btn.classList.toggle('disabled', !gameState.moveMode); });
    }
    
    function updateActionButtonsState() {
        const actionBtns = actionButtonsEl.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => { btn.classList.toggle('disabled', gameState.moveMode); });
    }

    // Funzione per controllare se un'azione ha ancora effetti
    function hasActionEffects(actionData) {
        if (!actionData.richiede_flag) return true;
        
        const flag = actionData.richiede_flag;
        if (flag.startsWith('!')) {
            // Flag negativo: l'azione ha effetti solo se il flag NON è presente
            return !gameState.playerFlags.has(flag.substring(1));
        } else {
            // Flag positivo: l'azione ha effetti solo se il flag è presente
            return gameState.playerFlags.has(flag);
        }
    }

    // Funzione per applicare modifiche alle risorse
    function applyResourceChanges(modifiche) {
        if (!modifiche) return;
        
        for (const [risorsa, quantita] of Object.entries(modifiche)) {
            if (!gameState.playerResources[risorsa]) {
                gameState.playerResources[risorsa] = 0;
            }
            gameState.playerResources[risorsa] += quantita;
            
            // Assicurati che le risorse non vadano sotto zero
            if (gameState.playerResources[risorsa] < 0) {
                gameState.playerResources[risorsa] = 0;
            }
        }
        
        // Aggiorna la visualizzazione delle risorse
        populateDataBox(resourcesContentEl, getRisorseDisplay(), 'quantita');
    }

    // Funzione per ottenere la descrizione corretta della location
    function getLocationDescription(locationData) {
        if (!locationData.descrizione_alternativa) {
            return locationData.descrizione;
        }
        
        // Controlla se ci sono flag che richiedono una descrizione alternativa
        for (const [flag, descrizione] of Object.entries(locationData.descrizione_alternativa)) {
            if (gameState.playerFlags.has(flag)) {
                return descrizione;
            }
        }
        
        return locationData.descrizione;
    }

    function renderLocation(locationId) {
        const locationData = allLocationData[locationId];
        if (!locationData) {
            console.error(`Location con id "${locationId}" non trovata!`);
            narrativeTextEl.textContent = "ERRORE: La location richiesta non esiste. Impossibile proseguire.";
            return;
        }
        locationNameEl.textContent = locationData.nome_location;
        narrativeTextEl.textContent = getLocationDescription(locationData);
        locationImageEl.src = locationData.path_immagine;
        locationImageEl.alt = `Immagine di ${locationData.nome_location}`;

        actionButtonsEl.innerHTML = '';
        for (const [key, value] of Object.entries(locationData.azioni)) {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.dataset.actionKey = key;
            
            // Determina il testo del pulsante
            const actionData = locationData.azioni_effetti && locationData.azioni_effetti[key];
            const actionKey = `${locationId}_${key}`;
            const clickCount = gameState.actionClickCount[actionKey] || 0;
            
            if (actionData && actionData.cambio_testo && clickCount > 0) {
                button.textContent = actionData.cambio_testo;
            } else {
                button.textContent = value;
            }
            
            // Controlla se il pulsante deve essere disattivato
            if (actionData && actionData.disattiva_dopo_uso && clickCount > 0) {
                button.classList.add('disabled');
                console.log(`Pulsante ${key} disattivato - click count: ${clickCount}`);
            }
            
            actionButtonsEl.appendChild(button);
        }
        gameState.actionChosen = false;
        gameState.moveMode = false;
        updateNavButtonsState();
        updateActionButtonsState();
    }

    // --- GESTORI DI EVENTI ---
    actionButtonsEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-btn') && !e.target.classList.contains('disabled')) {
            console.log(`Click su pulsante: ${e.target.textContent}, disabled: ${e.target.classList.contains('disabled')}`);
            const actionKey = e.target.dataset.actionKey;
            const locationData = allLocationData[gameState.currentLocationId];
            const actionKeyFull = `${gameState.currentLocationId}_${actionKey}`;
            
            console.log(`Azione scelta: ${e.target.textContent}`);
            
            // Incrementa il contatore dei click
            if (!gameState.actionClickCount[actionKeyFull]) {
                gameState.actionClickCount[actionKeyFull] = 0;
            }
            gameState.actionClickCount[actionKeyFull]++;
            console.log(`Click count per ${actionKeyFull}: ${gameState.actionClickCount[actionKeyFull]}`);
            
            // Controlla se ci sono effetti per questa azione
            let narrativeToShow = null;
            if (locationData.azioni_effetti && locationData.azioni_effetti[actionKey]) {
                const actionData = locationData.azioni_effetti[actionKey];
                const clickCount = gameState.actionClickCount[actionKeyFull];
                
                // Gestione azioni con max_click
                if (actionData.max_click) {
                    if (clickCount === 1) {
                        // Primo click
                        narrativeToShow = actionData.narrativa;
                        if (actionData.imposta_flag) {
                            gameState.playerFlags.add(actionData.imposta_flag);
                        }
                        applyResourceChanges(actionData.modifica_risorse);
                    } else if (clickCount === 2 && actionData.narrativa_seconda) {
                        // Secondo click
                        narrativeToShow = actionData.narrativa_seconda;
                    } else if (clickCount > 2 && actionData.narrativa_finale) {
                        // Click successivi
                        narrativeToShow = actionData.narrativa_finale;
                    }
                } else {
                    // Logica normale per azioni senza max_click
                    if (hasActionEffects(actionData)) {
                        narrativeToShow = actionData.narrativa;
                        if (actionData.imposta_flag) {
                            gameState.playerFlags.add(actionData.imposta_flag);
                        }
                        applyResourceChanges(actionData.modifica_risorse);
                    } else {
                        if (actionData.narrativa_ripetuta) {
                            narrativeToShow = actionData.narrativa_ripetuta;
                        } else {
                            narrativeToShow = actionData.narrativa + " (Già fatto)";
                        }
                    }
                }
            }
            
            gameState.actionChosen = true;
            // Ricarica la location per aggiornare i pulsanti
            renderLocation(gameState.currentLocationId);
            
            // Imposta la narrativa DOPO aver ricaricato la location
            if (narrativeToShow) {
                narrativeTextEl.textContent = narrativeToShow;
            }
        }
    });

    // Gestore per il pulsante MUOVI
    moveBtnEl.addEventListener('click', () => {
        gameState.moveMode = !gameState.moveMode;
        updateNavButtonsState();
        updateActionButtonsState();
        
        if (gameState.moveMode) {
            moveBtnEl.textContent = 'ANNULLA';
            narrativeTextEl.textContent = "Modalità movimento attivata. Scegli una direzione per muoverti.";
        } else {
            moveBtnEl.textContent = 'MUOVI';
            narrativeTextEl.textContent = getLocationDescription(allLocationData[gameState.currentLocationId]);
        }
    });

    navPadEl.addEventListener('click', async (e) => {
        if (e.target.classList.contains('nav-btn') && !e.target.classList.contains('disabled')) {
            const direction = e.target.dataset.direction;
            const currentLocation = allLocationData[gameState.currentLocationId];
            const nextLocationId = currentLocation.navigazione[direction];
            if (nextLocationId) {
                console.log(`Navigazione verso ${direction}: ${nextLocationId}`);
                
                // Carica la nuova scena se non è già stata caricata
                if (!allLocationData[nextLocationId]) {
                    const newScene = await loadScene(nextLocationId);
                    if (newScene) {
                        allLocationData[nextLocationId] = newScene;
                    } else {
                        narrativeTextEl.textContent = `Errore nel caricamento della scena ${nextLocationId}`;
                        return;
                    }
                }
                
                gameState.currentLocationId = nextLocationId;
                gameState.moveMode = false; // Reset modalità movimento dopo il movimento
                moveBtnEl.textContent = 'MUOVI'; // Reset testo pulsante
                renderLocation(nextLocationId);
            } else {
                console.log(`Non c'è uscita a ${direction}`);
                narrativeTextEl.textContent = `Non c'è un'uscita verso ${direction}. Scegli un'altra direzione.`;
            }
        }
    });

    // --- CARICAMENTO SCENE ---
    async function loadScene(locationId) {
        try {
            const response = await fetch(`scenes/${locationId}.json`);
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            return await response.json();
        } catch (error) {
            console.error(`Errore nel caricamento della scena ${locationId}:`, error);
            return null;
        }
    }

    // --- INIZIALIZZAZIONE ASINCRONA ---
    async function init() {
        console.log("Inizializzazione gioco...");
        try {
            // Carica la scena iniziale
            const initialScene = await loadScene(gameState.currentLocationId);
            if (initialScene) {
                allLocationData[gameState.currentLocationId] = initialScene;
            }
            
            // Popola tutti i box con i dati
            populateDataBox(resourcesContentEl, getRisorseDisplay(), 'quantita');
            populateDataBox(playerStatsContentEl, mockPlayerStats.attributi, 'valore');
            populateDataBox(factionScoresContentEl, mockFactionScores.fazioni, 'punteggio');
            
            renderLocation(gameState.currentLocationId);
            
        } catch (error) {
            console.error('Errore nel caricamento delle scene:', error);
            narrativeTextEl.textContent = "ERRORE CRITICO: Impossibile caricare i dati del mondo di gioco. Controlla la console.";
        }
    }

    init();
});