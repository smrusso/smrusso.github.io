self.onmessage = async (event) => {
    const { secret, scriptIdCiphertext, scriptIdIv, ibanCiphertext, ibanIv, checkCiphertext, checkIv } = event.data;

    const base64UrlToBytes = (base64Url) => {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const fromBase64 = (str) => new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));

    const salt = new Uint8Array([11, 22, 33, 44, 55, 66, 77, 88, 99, 10, 11, 12, 13, 14, 15, 16]);
    const iterations = 10000;

    try {
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            base64UrlToBytes(secret),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        const decrypt = async (ciphertext, iv) => {
            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: fromBase64(iv)
                },
                key,
                fromBase64(ciphertext)
            );
            return new TextDecoder().decode(decryptedData);
        };

        const decryptedCheck = await decrypt(checkCiphertext, checkIv);

        if (decryptedCheck !== 'check') {
            self.postMessage({ error: 'Invalid secret' });
            return;
        }

        const decryptedScriptId = await decrypt(scriptIdCiphertext, scriptIdIv);
        const decryptedIban = await decrypt(ibanCiphertext, ibanIv);

        self.postMessage({ 
            scriptId: decryptedScriptId, 
            iban: JSON.parse(decryptedIban) 
        });

    } catch (e) {
        self.postMessage({ error: e.message });
    }
};