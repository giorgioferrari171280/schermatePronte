document.addEventListener('DOMContentLoaded', () => {
    let playerState = {};
    let initialPoints = 0;
    let availablePoints = 0;
    
    const pointsValueEl = document.getElementById('points-value');
    const nameInputEl = document.getElementById('char-name');
    const leftColumnEl = document.querySelector('.column:first-child .attributes-box');
    const rightColumnEl = document.getElementById('right-attributes');
    const allSliders = [];

    // Funzione per aggiornare il display dei punti
    const updatePointsDisplay = () => {
        let spentPoints = 0;
        allSliders.forEach(slider => {
            spentPoints += parseInt(slider.value, 10);
        });
        availablePoints = initialPoints - spentPoints;
        pointsValueEl.textContent = availablePoints;
    };

    // Funzione per creare una riga di attributo (etichetta + slider)
    const createAttributeRow = (attribute, index) => {
        const row = document.createElement('div');
        row.className = 'attribute-row';

        const label = document.createElement('label');
        label.textContent = attribute.nome;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = attribute.valore;
        slider.dataset.index = index; // Associa lo slider all'attributo

        // Logica per la gestione dei punti
        slider.addEventListener('input', () => {
            let spentPoints = 0;
            allSliders.forEach(s => {
                spentPoints += parseInt(s.value, 10);
            });

            if (spentPoints > initialPoints) {
                // Se si superano i punti, si annulla l'ultima mossa
                const overspent = spentPoints - initialPoints;
                slider.value = parseInt(slider.value, 10) - overspent;
            }
            updatePointsDisplay();
        });

        row.appendChild(label);
        row.appendChild(slider);
        allSliders.push(slider);

        return row;
    };

    // Funzione di inizializzazione
    const initialize = async () => {
        const response = await fetch('giocatore.json');
        playerState = await response.json();
        initialPoints = playerState.puntiDisponibiliIniziali;

        // Pulisce le colonne prima di popolarle
        leftColumnEl.querySelectorAll('.attribute-row:not(:first-child)').forEach(el => el.remove());
        rightColumnEl.innerHTML = '';

        playerState.attributi.forEach((attr, index) => {
            const row = createAttributeRow(attr, index);
            if (index < 5) {
                leftColumnEl.appendChild(row);
            } else {
                rightColumnEl.appendChild(row);
            }
        });
        updatePointsDisplay();
    };

    // Logica Pulsanti
    document.getElementById('cancel-btn').addEventListener('click', () => {
        nameInputEl.value = '';
        allSliders.forEach(slider => slider.value = 0);
        updatePointsDisplay();
    });

    document.getElementById('create-btn').addEventListener('click', () => {
        if (nameInputEl.value.trim() === '') {
            alert('Per favore, inserisci un nome per il personaggio.');
            return;
        }

        // Salva i dati nell'oggetto di stato
        playerState.nome = nameInputEl.value;
        allSliders.forEach(slider => {
            const index = slider.dataset.index;
            playerState.attributi[index].valore = parseInt(slider.value, 10);
        });
        
        console.log("STATO GIOCATORE SALVATO:", playerState);
        alert(`Personaggio "${playerState.nome}" creato con successo! I dati sono visibili nella console (F12).`);
        // Qui andrebbe la logica per passare alla schermata successiva, es:
        // window.location.href = '/schermata_equip.html';
    });

    document.getElementById('home-btn').addEventListener('click', () => {
        // Assumendo che il menu principale sia in un file 'main_menu.html'
        // window.location.href = 'main_menu.html'; 
        alert("Ritorno alla Home Page...");
    });

    // Avvia tutto
    initialize();
});