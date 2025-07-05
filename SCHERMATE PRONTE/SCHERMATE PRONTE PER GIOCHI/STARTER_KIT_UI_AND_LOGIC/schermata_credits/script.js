// Attende che il contenuto della pagina sia completamente caricato
document.addEventListener('DOMContentLoaded', function() {

    // Funzione per caricare e mostrare i dati dei crediti
    async function loadCredits() {
        try {
            // Carica il file JSON
            const response = await fetch('credits.json');
            if (!response.ok) {
                throw new Error(`Errore HTTP! stato: ${response.status}`);
            }
            const data = await response.json();

            // Popola i campi dei crediti nella colonna di sinistra
            document.getElementById('ideato-da').textContent += ` ${data.credits.ideato_da}`;
            document.getElementById('musica-di').textContent += ` ${data.credits.musica_di}`;
            document.getElementById('immagini-di').textContent += ` ${data.credits.immagini_di}`;
            document.getElementById('script').textContent += ` ${data.credits.script}`;
            document.getElementById('testi-di').textContent += ` ${data.credits.testi_di}`;

            // Gestisce l'immagine del programmatore
            const programmerImage = document.getElementById('programmer-image');
            const imagePlaceholder = document.getElementById('image-placeholder');

            if (data.programmer && data.programmer.image_path) {
                programmerImage.src = data.programmer.image_path;
                
                // Mostra l'immagine e nasconde il testo segnaposto
                programmerImage.style.display = 'block';
                imagePlaceholder.style.display = 'none';

                // Imposta l'attributo alt per l'accessibilità
                programmerImage.alt = `Immagine di ${data.programmer.name}`;
            } else {
                // Se non c'è immagine, lascia il segnaposto
                imagePlaceholder.textContent = "Immagine non trovata.";
            }

        } catch (error) {
            console.error("Impossibile caricare i dati dei crediti:", error);
            // Mostra un errore all'utente se qualcosa va storto
            document.querySelector('.right-column .image-container').innerHTML = `<p>Errore nel caricamento dei dati.</p>`;
        }
    }

    // Esegue la funzione
    loadCredits();

    // Aggiunge un evento al pulsante "INDIETRO" (esempio)
    document.querySelector('.back-button').addEventListener('click', () => {
        // Qui potresti inserire il codice per tornare alla schermata precedente
        // ad esempio: window.location.href = 'menu.html';
        alert('Torno al menu principale!');
    });
});