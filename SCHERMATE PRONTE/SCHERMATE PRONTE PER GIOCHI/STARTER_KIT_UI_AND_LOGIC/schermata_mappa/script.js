document.addEventListener('DOMContentLoaded', () => {
    const mapGrid = document.getElementById('map-grid');
    const selectedLocationImage = document.getElementById('selected-location-image');
    const selectedLocationDescription = document.getElementById('selected-location-description');
    const goButton = document.getElementById('go-button');
    const backButton = document.getElementById('back-button');

    let allLocations = [];
    let visitedLocations = [];

    // Carica i dati del gioco (locations e dati del giocatore)
    async function loadGameData() {
        try {
            const [locationsResponse, playerResponse] = await Promise.all([
                fetch('locations.json'),
                fetch('player.json')
            ]);
            
            allLocations = await locationsResponse.json();
            const playerData = await playerResponse.json();
            visitedLocations = playerData.location_visitate;
            
            populateMap();
        } catch (error) {
            console.error("Errore nel caricamento dei dati di gioco:", error);
            mapGrid.innerHTML = '<p>Impossibile caricare la mappa.</p>';
        }
    }

    // Popola la griglia della mappa con le location
    function populateMap() {
        mapGrid.innerHTML = ''; // Pulisce la griglia
        
        allLocations.forEach(location => {
            const locationBox = document.createElement('div');
            locationBox.classList.add('location-box');
            
            const isVisited = visitedLocations.includes(location.id);

            // Crea il contenuto del box (immagine)
            const img = document.createElement('img');
            img.src = location.image_url;
            img.alt = location.name;
            locationBox.appendChild(img);

            if (isVisited) {
                locationBox.classList.add('clickable');
                locationBox.addEventListener('click', () => selectLocation(location));
            } else {
                locationBox.classList.add('grayscale');
            }
            
            mapGrid.appendChild(locationBox);
        });
    }

    // Gestisce la selezione di una location
    function selectLocation(location) {
        // Aggiorna l'immagine della location selezionata
        selectedLocationImage.innerHTML = `<img src="${location.image_url}" alt="Immagine di ${location.name}">`;
        
        // Aggiorna la descrizione
        selectedLocationDescription.textContent = location.short_description;
        
        // Attiva il pulsante "VAI QUI"
        goButton.disabled = false;
        goButton.onclick = () => {
            alert(`Ti stai spostando verso: ${location.name}`);
            // Qui andrebbe la logica per cambiare schermata
        };
    }
    
    // Logica per il pulsante "INDIETRO"
    backButton.addEventListener('click', () => {
        alert("Tornando alla schermata precedente...");
        // Esempio: window.history.back();
    });

    // Avvia il caricamento dei dati
    loadGameData();
});