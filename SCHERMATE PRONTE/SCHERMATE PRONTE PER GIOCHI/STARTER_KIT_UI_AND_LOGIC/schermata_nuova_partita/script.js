document.addEventListener('DOMContentLoaded', function() {
    // Selezione degli elementi dall'interfaccia
    const saveSlots = document.querySelectorAll('.save-slot');
    const startButton = document.getElementById('btn-start');
    const backButton = document.getElementById('btn-back');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalConfirmButton = document.getElementById('modal-confirm');
    const modalCancelButton = document.getElementById('modal-cancel');

    let selectedSlot = null;
    let slotToOverwrite = null; // Memorizza lo slot occupato cliccato

    // Funzione per selezionare uno slot
    function selectSlot(slot) {
        saveSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedSlot = slot;
        startButton.disabled = false;
    }

    // Aggiunge un listener a ogni slot di salvataggio
    saveSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            // Se lo slot è occupato, mostra il modale
            if (slot.classList.contains('occupied')) {
                slotToOverwrite = slot; // Memorizza quale slot si intende sovrascrivere
                modalOverlay.classList.remove('hidden');
            } else {
                // Se lo slot è vuoto, selezionalo direttamente
                selectSlot(slot);
            }
        });
    });

    // Logica del pulsante "INIZIA!"
    startButton.addEventListener('click', () => {
        if (!startButton.disabled && selectedSlot) {
            const slotNumber = selectedSlot.dataset.slot;
            alert(`Inizio nuova partita nello SLOT ${slotNumber}...`);
            // Qui andrebbe la logica per creare un nuovo giocatore
        }
    });

    // Logica del pulsante "INDIETRO"
    backButton.addEventListener('click', () => {
        alert('Ritorno al menu principale...');
        // Esempio: window.location.href = 'main_menu.html';
    });
    
    // --- Logica del Modale ---

    // Pulsante "CONFERMA" nel modale
    modalConfirmButton.addEventListener('click', () => {
        if (slotToOverwrite) {
            selectSlot(slotToOverwrite); // Seleziona lo slot che si è deciso di sovrascrivere
        }
        modalOverlay.classList.add('hidden'); // Nasconde il modale
        slotToOverwrite = null; // Resetta la variabile
    });

    // Pulsante "ANNULLA" nel modale
    modalCancelButton.addEventListener('click', () => {
        modalOverlay.classList.add('hidden'); // Nasconde il modale
        slotToOverwrite = null; // Resetta la variabile, non succede nulla
    });
});