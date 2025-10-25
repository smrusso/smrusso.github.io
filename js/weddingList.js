document.addEventListener('DOMContentLoaded', function () {
    let scriptId = null;
    const worker = new Worker('js/decrypt.js');

    const displayQrCodeMessage = (container) => {
        const messageH4 = document.createElement('h4');
        messageH4.textContent = 'Scansiona il codice QR per vedere i dettagli';
        container.innerHTML = '';
        container.appendChild(messageH4);
    };

    const handleIbanVisibility = async () => {
        const secret = new URLSearchParams(window.location.search).get('secret');
        const ibanDetailsContainer = document.getElementById('iban-details');

        const checkCiphertext = document.getElementById('check-ciphertext').textContent;
        const checkIv = document.getElementById('check-iv').textContent;
        const ibanCiphertext = document.getElementById('iban-ciphertext').textContent;
        const ibanIv = document.getElementById('iban-iv').textContent;
        const scriptIdCiphertext = document.getElementById('script-id-ciphertext').textContent;
        const scriptIdIv = document.getElementById('script-id-iv').textContent;

        if (!secret || scriptIdCiphertext === 'CIPHERTEXT_HERE' || scriptIdIv === 'IV_HERE' || ibanCiphertext === 'CIPHERTEXT_HERE' || ibanIv === 'IV_HERE' || checkCiphertext === 'CIPHERTEXT_HERE' || checkIv === 'IV_HERE') {
            displayQrCodeMessage(ibanDetailsContainer);
            return;
        }

        const loadingIndicator = document.createElement('h4');
        loadingIndicator.textContent = 'Decifrando i dati...';
        ibanDetailsContainer.appendChild(loadingIndicator);

        worker.postMessage({
            secret,
            scriptIdCiphertext,
            scriptIdIv,
            ibanCiphertext,
            ibanIv,
            checkCiphertext,
            checkIv
        });
    }

    worker.onmessage = (event) => {
        const ibanDetailsContainer = document.getElementById('iban-details');
        ibanDetailsContainer.innerHTML = '';

        if (event.data.error) {
            displayQrCodeMessage(ibanDetailsContainer);
            return;
        }

        const {scriptId: decryptedScriptId, iban: decryptedIban} = event.data;
        scriptId = decryptedScriptId;
        document.getElementById('script-id').textContent = decryptedScriptId;

        const ibanContainer = document.createElement('div');
        const ibanEl = document.createElement('span');
        const ibanOwnerEl = document.createElement('span');

        ibanEl.textContent = decryptedIban.iban;
        ibanOwnerEl.textContent = decryptedIban.owner;

        const ibanH4 = document.createElement('h4');
        ibanH4.innerHTML = 'IBAN: ';
        ibanH4.appendChild(ibanEl);

        const ownerH4 = document.createElement('h4');
        ownerH4.innerHTML = 'Intestato a: ';
        ownerH4.appendChild(ibanOwnerEl);

        ibanContainer.appendChild(ibanH4);
        ibanContainer.appendChild(ownerH4);

        ibanDetailsContainer.appendChild(ibanContainer);
    };

    handleIbanVisibility();
});