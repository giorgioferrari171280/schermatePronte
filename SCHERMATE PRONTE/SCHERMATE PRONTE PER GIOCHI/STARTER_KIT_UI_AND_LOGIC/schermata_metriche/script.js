document.addEventListener('DOMContentLoaded', () => {
    
    const colonnaSinistra = document.getElementById('colonna-sinistra');
    const colonnaDestra = document.getElementById('colonna-destra');

    fetch('giocatore.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore di rete o file non trovato.');
            }
            return response.json();
        })
        .then(data => {
            const metriche = data.metriche;

            colonnaSinistra.innerHTML = '';
            colonnaDestra.innerHTML = '';
            
            metriche.forEach((metrica, index) => {
                
                const valoreValido = Math.max(0, Math.min(100, metrica.valore));

                // MODIFICA: Lo <span> "valore-numerico" ora è fuori dal "barra-contenitore",
                // posizionandosi come terzo elemento nella riga.
                const rigaMetricaHTML = `
                    <div class="riga-metrica">
                        <div class="etichetta-metrica">${metrica.nome}</div>
                        <div class="barra-contenitore">
                            <div class="barra-progresso" style="width: ${valoreValido}%;"></div>
                        </div>
                        <span class="valore-numerico">${valoreValido}</span>
                    </div>
                `;

                if (index < 7) {
                    colonnaSinistra.innerHTML += rigaMetricaHTML;
                } else {
                    colonnaDestra.innerHTML += rigaMetricaHTML;
                }
            });
        })
        .catch(error => {
            console.error('Impossibile caricare i dati del personaggio:', error);
            colonnaSinistra.innerHTML = "<p>Errore nel caricamento delle statistiche.</p>";
        });
});