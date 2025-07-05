document.addEventListener('DOMContentLoaded', () => {
    // --- DATI DI GIOCO GLOBALI ---
    let scenariDiGioco = [];
    let scenarioCorrenteIndex = 0;
    
    // Dati del giocatore
    let playerData = {
        metriche: [
            { id: "liquidita", nome: "Liquidità", valore: 70 },
            { id: "riserve_idriche", nome: "Riserve Idriche", valore: 80 },
            { id: "salute_colture", nome: "Salute Colture", valore: 60 },
            { id: "reputazione_locale", nome: "Reputazione Locale", valore: 50 },
            { id: "sostenibilita", nome: "Sostenibilità", valore: 40 },
            { id: "morale_familiare", nome: "Morale Familiare", valore: 75 },
            { id: "debito", nome: "Debito", valore: 20 },
            { id: "valore_azienda", nome: "Valore Azienda", valore: 85 },
            { id: "fertilita_terreno", nome: "Fertilità Terreno", valore: 65 },
            { id: "efficienza_attrezzature", nome: "Efficienza Attrezzature", valore: 90 },
            { id: "produzione_prevista", nome: "Produzione Prevista", valore: 80 },
            { id: "stress", nome: "Livello di Stress", valore: 30 }
        ]
    };

    // --- SELEZIONE DEGLI ELEMENTI DEL DOM ---
    const scenarioTitle = document.getElementById('scenario-title');
    const scenarioImage = document.getElementById('scenario-image');
    const scenarioDescription = document.getElementById('scenario-description');
    const impactDescription = document.getElementById('impact-box').querySelector('p'); // Seleziona il paragrafo interno
    const choicesContainer = document.getElementById('choices-container');
    const metricsContainer = document.getElementById('metrics-container');
    const gameContainer = document.getElementById('game-container');
    
    // NUOVI: Elementi per la finestra modale
    const modalOverlay = document.getElementById('modal-overlay');
    const endChapterModal = document.getElementById('end-chapter-modal');
    const modalMetricsContainer = document.getElementById('modal-metrics-container');
    const replayButton = document.getElementById('replay-button');
    const continueButton = document.getElementById('continue-button');


    // --- FUNZIONI DI GIOCO ---
    
    /**
     * Carica i dati dello scenario nell'interfaccia.
     */
    function loadScenario(data) {
        // La vecchia logica di fine gioco è stata rimossa da qui
        scenarioTitle.textContent = data.titolo_scenario;
        scenarioImage.src = data.path_immagine_scenario;
        scenarioDescription.textContent = data.narrativa_scenario;
        impactDescription.textContent = data.narrativa_impatto;

        choicesContainer.innerHTML = '';
        data.scelte.forEach((scelta) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = scelta.testo;
            button.addEventListener('click', () => handleChoice(scelta));
            choicesContainer.appendChild(button);
        });
    }

    /**
     * Aggiorna la visualizzazione di tutte le metriche.
     */
    function updateMetrics() {
        metricsContainer.innerHTML = '';
        playerData.metriche.forEach(metrica => {
            const metricElement = document.createElement('div');
            metricElement.className = 'metric';
            
            const nameElement = document.createElement('span');
            nameElement.className = 'metric-name';
            nameElement.textContent = metrica.nome;
            
            const barContainer = document.createElement('div');
            barContainer.className = 'progress-bar-container';
            
            const bar = document.createElement('div');
            bar.className = 'progress-bar';
            bar.style.width = `${metrica.valore}%`;

            barContainer.appendChild(bar);
            metricElement.appendChild(nameElement);
            metricElement.appendChild(barContainer);
            metricsContainer.appendChild(metricElement);
        });
    }

    /**
     * Gestisce il click su un pulsante di scelta.
     */
    function handleChoice(sceltaEffettuata) {
        // Applica l'impatto della scelta
        for (const [key, value] of Object.entries(sceltaEffettuata.impatto)) {
            const metrica = playerData.metriche.find(m => m.id === key);
            if (metrica) {
                metrica.valore = Math.max(0, Math.min(100, metrica.valore + value));
            }
        }
        updateMetrics();

        // Avanza allo scenario successivo
        scenarioCorrenteIndex++;

        // MODIFICA: Controlla se il gioco è finito
        if (scenarioCorrenteIndex >= scenariDiGioco.length) {
            // Se gli scenari sono finiti, mostra la finestra modale
            showEndChapterModal();
        } else {
            // Altrimenti, carica il prossimo scenario
            loadScenario(scenariDiGioco[scenarioCorrenteIndex]);
        }
    }

    /**
     * NUOVA: Mostra la finestra modale di fine capitolo.
     */
    function showEndChapterModal() {
        // Popola la modale con le metriche finali copiandole
        modalMetricsContainer.innerHTML = metricsContainer.innerHTML;

        // Mostra la modale e lo sfondo
        modalOverlay.classList.remove('hidden');
        endChapterModal.classList.remove('hidden');
    }

    /**
     * Funzione principale per inizializzare il gioco.
     */
    async function initializeGame() {
        try {
            const response = await fetch('scenari.json');
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            scenariDiGioco = await response.json();
            
            // Il gioco inizia qui, dopo aver caricato i dati
            updateMetrics();
            loadScenario(scenariDiGioco[scenarioCorrenteIndex]);

        } catch (error) {
            console.error("Impossibile caricare gli scenari:", error);
            gameContainer.innerHTML = '<h1>Errore</h1><p>Impossibile caricare il file degli scenari. Assicurati di eseguire il gioco da un server locale.</p>';
        }
    }
    
    // NUOVI: Event listener per i bottoni della modale
    replayButton.addEventListener('click', () => {
        location.reload(); // Ricarica la pagina per giocare di nuovo
    });

    continueButton.addEventListener('click', () => {
        alert('Grazie per aver giocato! Il prossimo capitolo non è ancora disponibile.');
        modalOverlay.classList.add('hidden');
        endChapterModal.classList.add('hidden');
    });

    // Avvia il gioco
    initializeGame();
});