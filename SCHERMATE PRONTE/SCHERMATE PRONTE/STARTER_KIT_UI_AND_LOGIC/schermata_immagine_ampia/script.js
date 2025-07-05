// --- DATI DI GIOCO (Simulazione di un file .json) ---
const gameData = {
    1: {
        id: 1,
        titolo_schermata: "L'Arrivo al Campo",
        narrativa: "Il sole implacabile del Tanganica batte sulla tenda di tela, creando un'atmosfera soffocante. L'odore di polvere e spezie esotiche riempie l'aria. La tua guida locale, un uomo anziano di nome Jabari, attende in silenzio la tua prossima mossa.",
        // --- MODIFICA CHIAVE ---
        // Il percorso ora punta a un file locale.
        path_immagine: "asset/accampamento.png",
        scelte: [
            { testo: "Ispeziona la tenda", destinazione: 2 },
            { testo: "Parla con la guida", destinazione: 3 }
        ]
    },
    2: {
        id: 2,
        titolo_schermata: "Dentro la Tenda",
        narrativa: "All'interno, una brandina, una cassa di legno e una vecchia mappa srotolata su un tavolino da campo. La mappa mostra un percorso segnato in rosso verso delle colline inesplorate. Noti un diario di pelle accanto alla mappa.",
        path_immagine: "https://placehold.co/800x600/3A2E1D/F0E68C?text=Mappa+e+Diario",
        scelte: [
            { testo: "Esamina la mappa", destinazione: 4 },
            { testo: "Leggi il diario", destinazione: 5 },
            { testo: "Torna fuori", destinazione: 1 }
        ]
    },
    3: {
        id: 3,
        titolo_schermata: "Dialogo con Jabari",
        narrativa: "Ti avvicini a Jabari. I suoi occhi saggi ti scrutano. 'Le antiche rovine non sono lontane,' dice con voce roca, 'ma gli spiriti della savana sono irrequieti. Dobbiamo portare un'offerta. Cosa scegli?'",
        path_immagine: "https://placehold.co/800x600/556B2F/FFFFFF?text=Guida+Jabari",
        scelte: [
            { testo: "Offri del tabacco", destinazione: 6 },
            { testo: "Offri delle perline", destinazione: 6 }
        ]
    },
    // Aggiungi qui altre schermate (4, 5, 6...) per continuare la storia
    4: {
        id: 4,
        titolo_schermata: "La Mappa Misteriosa",
        narrativa: "La mappa è disegnata a mano con una precisione impressionante. Il sentiero rosso conduce a un'icona che sembra una zanna di elefante. Un simbolo che non riconosci.",
        path_immagine: "https://placehold.co/800x600/D2B48C/3A2E1D?text=Dettaglio+Mappa",
        scelte: [
            { testo: "Torna indietro", destinazione: 2 }
        ]
    },
    5: {
        id: 5,
        titolo_schermata: "Il Diario Perduto",
        narrativa: "L'ultima pagina del diario recita: '...l'ho trovato. Il manufatto è reale, ma la sua influenza è maligna. Non posso portarlo con me. L'ho nascosto dove solo chi conosce la leggenda della Zanna può trovarlo.'",
        path_immagine: "https://placehold.co/800x600/8B4513/F5F5DC?text=Pagina+del+Diario",
        scelte: [
            { testo: "Torna indietro", destinazione: 2 }
        ]
    },
     6: {
        id: 6,
        titolo_schermata: "L'Offerta Accettata",
        narrativa: "Jabari annuisce, accettando la tua offerta. 'Gli spiriti sono placati. Possiamo partire al tramonto. Preparati.' La spedizione sta per iniziare.",
        path_immagine: "https://placehold.co/800x600/FF4500/000000?text=Tramonto",
        scelte: [
            { testo: "Fine della demo", destinazione: 1 }
        ]
    }
};

// --- LOGICA DI GIOCO ---
document.addEventListener('DOMContentLoaded', () => {
    // Seleziona gli elementi del DOM
    const titleElement = document.getElementById('screen-title-box');
    const narrativeElement = document.getElementById('narrative-text');
    const imageElement = document.getElementById('scene-image');
    const choiceButtonsContainer = document.getElementById('choice-buttons');

    /**
     * Carica una schermata di gioco in base al suo ID.
     * @param {number} screenId L'ID della schermata da caricare.
     */
    function loadScreen(screenId) {
        const screenData = gameData[screenId];

        if (!screenData) {
            console.error(`Schermata con ID ${screenId} non trovata!`);
            return;
        }

        // 1. Aggiorna il contenuto testuale e l'immagine
        titleElement.textContent = screenData.titolo_schermata;
        narrativeElement.textContent = screenData.narrativa;
        imageElement.src = screenData.path_immagine;
        imageElement.alt = screenData.titolo_schermata;

        // 2. Pulisce i pulsanti di scelta precedenti
        choiceButtonsContainer.innerHTML = '';

        // 3. Crea e aggiunge i nuovi pulsanti di scelta
        screenData.scelte.forEach(scelta => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = scelta.testo;
            
            // Aggiunge l'evento click che carica la schermata di destinazione
            button.addEventListener('click', () => {
                loadScreen(scelta.destinazione);
            });
            
            choiceButtonsContainer.appendChild(button);
        });
    }

    // Carica la prima schermata all'avvio
    loadScreen(1);

    // Aggiungi logica per i pulsanti del menu principale (opzionale)
    document.getElementById('btn-character').addEventListener('click', () => alert('Schermata PERSONAGGIO non implementata.'));
    document.getElementById('btn-influence').addEventListener('click', () => alert('Schermata INFLUENZA non implementata.'));
    document.getElementById('btn-home').addEventListener('click', () => loadScreen(1)); // Torna alla prima schermata
    document.getElementById('btn-options').addEventListener('click', () => alert('Schermata OPZIONI non implementata.'));
});