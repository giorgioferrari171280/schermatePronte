document.addEventListener('DOMContentLoaded', function() {
    const saveSlots = document.querySelectorAll('.save-slot');
    const loadButton = document.getElementById('btn-load');
    const backButton = document.getElementById('btn-back');

    let selectedSlot = null;

    saveSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            // Rimuove la selezione da tutti gli altri slot
            saveSlots.forEach(s => s.classList.remove('selected'));
            
            // Aggiunge la selezione allo slot cliccato
            slot.classList.add('selected');
            selectedSlot = slot;

            // Abilita il pulsante CARICA solo se lo slot è valido (occupato)
            if (slot.classList.contains('occupied')) {
                loadButton.disabled = false;
            } else {
                loadButton.disabled = true;
            }
        });
    });

    loadButton.addEventListener('click', () => {
        if (!loadButton.disabled && selectedSlot) {
            const slotNumber = selectedSlot.dataset.slot;
            alert(`Caricamento partita dallo SLOT ${slotNumber}...`);
            // Qui andrebbe la logica per caricare il file giocatore_slot[numero].json
        }
    });

    backButton.addEventListener('click', () => {
        alert('Ritorno al menu principale...');
        // Qui andrebbe la logica per tornare alla schermata precedente, es:
        // window.location.href = 'main_menu.html';
    });
});