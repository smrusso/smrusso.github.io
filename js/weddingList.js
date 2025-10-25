document.addEventListener('DOMContentLoaded', function () {
    const worker = new Worker('js/decrypt.js');

    const handleIbanVisibility = async () => {
        document.getElementById('gift-decrypting').classList.remove('d-none');

        const secret = new URLSearchParams(window.location.search).get('secret');
        if (!secret) {
            document.getElementById('gift-scan-qr').classList.remove('d-none');
            document.getElementById('gift-decrypting').classList.add('d-none');
            return;
        }

        worker.postMessage({
            secret,
            scriptIdCiphertext: document.getElementById('script-id-ciphertext').textContent,
            scriptIdIv: document.getElementById('script-id-iv').textContent,
            ibanCiphertext: document.getElementById('iban-ciphertext').textContent,
            ibanIv: document.getElementById('iban-iv').textContent,
            checkCiphertext: document.getElementById('check-ciphertext').textContent,
            checkIv: document.getElementById('check-iv').textContent
        });
    }

    worker.onmessage = (event) => {
        if (event.data.error) {
            document.getElementById('gift-scan-qr').classList.remove('d-none');
            document.getElementById('gift-decrypting').classList.add('d-none');
            return;
        }

        const {scriptId: decryptedScriptId, iban: decryptedIban} = event.data;
        document.getElementById('script-id').textContent = decryptedScriptId;

        document.getElementById('gift-iban-value').textContent = decryptedIban.iban;
        document.getElementById('gift-owner-value').textContent = decryptedIban.owner;
        document.getElementById('gift-decrypting').classList.add('d-none');


        document.getElementById('gift-iban').classList.remove('d-none');
        document.getElementById('gift-owner').classList.remove('d-none');
    };

    handleIbanVisibility();
});
