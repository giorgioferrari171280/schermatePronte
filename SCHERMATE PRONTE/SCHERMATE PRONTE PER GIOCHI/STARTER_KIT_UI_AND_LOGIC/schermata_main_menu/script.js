document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.menu-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            switch(buttonText) {
                case 'NUOVA PARTITA':
                    window.location.href = '../schermata_nuova_partita/index.html';
                    break;
                case 'CARICA PARTITA':
                    window.location.href = '../schermata_carica_partita/index.html';
                    break;
                case 'OPZIONI':
                    window.location.href = '../schermata_opzioni/index.html';
                    break;
                case 'HALL OF FAME':
                    window.location.href = '../schermata_achievements/index.html';
                    break;
                case 'CREDITS':
                    window.location.href = '../schermata_credits/index.html';
                    break;
                case 'COMPRA DLC':
                    window.location.href = '../schermata_compra_dlc/index.html';
                    break;
                case 'ESCI DAL GIOCO':
                    if (confirm('Sei sicuro di voler uscire dal gioco?')) {
                        window.close();
                    }
                    break;
            }
        });
    });
});