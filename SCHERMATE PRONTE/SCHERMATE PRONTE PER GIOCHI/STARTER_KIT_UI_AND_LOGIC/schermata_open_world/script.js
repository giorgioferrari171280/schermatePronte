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
            button.textContent = value;
            
            // Tutti i pulsanti sono sempre cliccabili
            
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
            const actionKey = e.target.dataset.actionKey;
            const locationData = allLocationData[gameState.currentLocationId];
            
            console.log(`Azione scelta: ${e.target.textContent}`);
            
            // Controlla se ci sono effetti per questa azione
            if (locationData.azioni_effetti && locationData.azioni_effetti[actionKey]) {
                const actionData = locationData.azioni_effetti[actionKey];
                
                // Verifica se l'azione ha ancora effetti
                if (hasActionEffects(actionData)) {
                    // Prima volta: narrativa normale con effetti
                    narrativeTextEl.textContent = actionData.narrativa;
                    
                    // Imposta flag se necessario
                    if (actionData.imposta_flag) {
                        gameState.playerFlags.add(actionData.imposta_flag);
                    }
                    
                    // Applica modifiche alle risorse
                    applyResourceChanges(actionData.modifica_risorse);
                } else {
                    // Azione già fatta: narrativa ripetuta senza effetti
                    if (actionData.narrativa_ripetuta) {
                        narrativeTextEl.textContent = actionData.narrativa_ripetuta;
                    } else {
                        narrativeTextEl.textContent = actionData.narrativa + " (Già fatto)";
                    }
                }
            }
            
            gameState.actionChosen = true;
            // Non disabilitare più tutti i pulsanti azione
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

    navPadEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-btn') && !e.target.classList.contains('disabled')) {
            const direction = e.target.dataset.direction;
            const currentLocation = allLocationData[gameState.currentLocationId];
            const nextLocationId = currentLocation.navigazione[direction];
            if (nextLocationId) {
                console.log(`Navigazione verso ${direction}: ${nextLocationId}`);
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

    // --- INIZIALIZZAZIONE ASINCRONA ---
    async function init() {
        console.log("Inizializzazione gioco...");
        try {
            const response = await fetch('data.json');
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            allLocationData = await response.json();
            
            // Popola tutti i box con i dati
            populateDataBox(resourcesContentEl, getRisorseDisplay(), 'quantita');
            populateDataBox(playerStatsContentEl, mockPlayerStats.attributi, 'valore');
            populateDataBox(factionScoresContentEl, mockFactionScores.fazioni, 'punteggio');
            
            renderLocation(gameState.currentLocationId);
            
        } catch (error) {
            console.error('Errore nel caricamento del file data.json:', error);
            narrativeTextEl.textContent = "ERRORE CRITICO: Impossibile caricare i dati del mondo di gioco. Controlla la console.";
        }
    }

    init();
});