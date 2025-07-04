document.addEventListener('DOMContentLoaded', () => {

    // Selettori degli elementi
    const linguaSelect = document.getElementById('linguaSelect');
    const volumeSlider = document.querySelector('.audio-slider');
    const testoSelect = document.getElementById('testoSelect');
    const temaSelect = document.getElementById('temaSelect');
    const indietroButton = document.querySelector('.back-button');
    const audioIcon = document.getElementById('audioIconContainer');
    const rootElement = document.documentElement; // <-- CORREZIONE: Seleziona l'elemento <html>

    /**
     * Applica la classe di dimensione del font all'elemento radice <html>.
     * @param {string} size - La dimensione scelta (es. "small", "normal", "large").
     */
    function applyTextSize(size) {
        rootElement.classList.remove('font-small', 'font-normal', 'font-large');
        if (size) {
            rootElement.classList.add(`font-${size}`);
        }
        console.log(`Dimensione font applicata a <html>: ${size}`);
    }

    /**
     * Carica e applica una lingua da un file JSON.
     * @param {string} lang - Il codice della lingua (es. "it", "en").
     */
    async function loadLanguage(lang) {
        try {
            const response = await fetch(`${lang}.json`);
            if (!response.ok) throw new Error(`File ${lang}.json non trovato.`);
            
            const translations = await response.json();
            
            document.querySelectorAll('[data-key]').forEach(elem => {
                const key = elem.getAttribute('data-key');
                if (translations[key]) {
                    elem.textContent = translations[key];
                }
            });
        } catch (error) {
            console.error("Errore nel caricamento della lingua:", error);
            if (lang !== 'it') loadLanguage('it');
        }
    }

    /**
     * Salva le preferenze correnti nel localStorage.
     */
    function salvaImpostazioni() {
        const preferenzeUtente = {
            lingua: linguaSelect.value,
            volume: volumeSlider.value,
            dimensioneTesto: testoSelect.value,
            tema: temaSelect.value
        };
        localStorage.setItem('giocatore', JSON.stringify(preferenzeUtente));
        console.log('Impostazioni salvate!', preferenzeUtente);
    }

    /**
     * Carica le impostazioni salvate dal localStorage all'avvio.
     */
    function caricaImpostazioni() {
        const preferenzeSalvate = localStorage.getItem('giocatore');
        let linguaDaCaricare = 'it';
        let dimensioneTestoDaCaricare = 'normal';

        if (preferenzeSalvate) {
            const impostazioni = JSON.parse(preferenzeSalvate);
            
            linguaSelect.value = impostazioni.lingua || 'it';
            volumeSlider.value = impostazioni.volume || 75;
            testoSelect.value = impostazioni.dimensioneTesto || 'normal';
            temaSelect.value = impostazioni.tema || 'Light';
            
            linguaDaCaricare = impostazioni.lingua || 'it';
            dimensioneTestoDaCaricare = impostazioni.dimensioneTesto || 'normal';

            console.log('Impostazioni caricate con successo!');
        }
        
        loadLanguage(linguaDaCaricare);
        applyTextSize(dimensioneTestoDaCaricare);
    }

    // ---------- EVENT LISTENERS ----------

    indietroButton.addEventListener('click', () => {
        salvaImpostazioni();
        alert("Impostazioni salvate! Si torna al menu principale.");
        // window.history.back();
    });

    linguaSelect.addEventListener('change', () => {
        loadLanguage(linguaSelect.value);
    });

    audioIcon.addEventListener('click', () => {
        volumeSlider.value = 0;
        console.log("Audio impostato a zero!");
    });
    
    testoSelect.addEventListener('change', () => {
        applyTextSize(testoSelect.value);
    });

    // Carica le impostazioni iniziali
    caricaImpostazioni();
});