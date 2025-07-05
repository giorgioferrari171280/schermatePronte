document.addEventListener('DOMContentLoaded', () => {

    const dlcCards = document.querySelectorAll('.dlc-card');
    const purchaseButton = document.getElementById('purchase-button');
    const backButton = document.getElementById('back-button');

    let selectedDlc = null;

    // Aggiunge un gestore di eventi a ogni card DLC
    dlcCards.forEach(card => {
        card.addEventListener('click', () => {
            // Rimuove la classe 'selected' da tutte le altre card
            dlcCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('selected');
                }
            });

            // Aggiunge o rimuove la classe 'selected' alla card cliccata
            card.classList.toggle('selected');
            
            // Controlla se c'è una card selezionata
            if (card.classList.contains('selected')) {
                selectedDlc = card.dataset.dlc;
                purchaseButton.disabled = false; // Abilita il pulsante Acquista
            } else {
                selectedDlc = null;
                purchaseButton.disabled = true; // Disabilita il pulsante Acquista
            }
        });
    });

    // Aggiunge logica per i pulsanti (al momento solo un console.log)
    purchaseButton.addEventListener('click', () => {
        if (!purchaseButton.disabled) {
            console.log(`Avvio acquisto per il DLC ${selectedDlc}...`);
            alert(`Hai selezionato l'acquisto per il DLC ${selectedDlc}!`);
        }
    });

    backButton.addEventListener('click', () => {
        console.log("Torno alla schermata precedente...");
        alert("Torno indietro..."); // In un gioco vero, qui ci sarebbe il codice per cambiare schermata
    });

});