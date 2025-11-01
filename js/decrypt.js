self.onmessage = async (event) => {
    const { secret, scriptIdCiphertext, scriptIdIv, ibanCiphertext, ibanIv, checkCiphertext, checkIv } = event.data;

    // Decode URL-safe Base64 to bytes
    const base64UrlToBytes = (base64Url) => {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };
    
    // Decode standard Base64 to bytes
    const fromBase64 = (str) => {
        const binaryString = atob(str);
        return Uint8Array.from(binaryString, c => c.charCodeAt(0));
    };

    try {
        // Import the raw secret as an AES-GCM key
        const key = await crypto.subtle.importKey(
            'raw',
            base64UrlToBytes(secret),
            { name: 'AES-GCM', length: 128 },
            false, // Key is not extractable
            ['decrypt']
        );

        // General-purpose decryption function
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
        
        // --- Decryption and Validation ---

        // 1. Decrypt the check string first to validate the secret key
        const decryptedCheck = await decrypt(checkCiphertext, checkIv);
        if (decryptedCheck !== 'check') {
            // If it fails, post an error and stop. This is a simple way to check the key's validity.
            self.postMessage({ error: 'Invalid secret' });
            return;
        }

        // 2. If the check passes, proceed with decrypting the actual data
        const decryptedScriptId = await decrypt(scriptIdCiphertext, scriptIdIv);
        const decryptedIban = await decrypt(ibanCiphertext, ibanIv);

        // 3. Post the successfully decrypted data back to the main thread
        self.postMessage({ 
            scriptId: decryptedScriptId, 
            iban: JSON.parse(decryptedIban) 
        });

    } catch (e) {
        // If any error occurs (e.g., decryption failure), post a generic error message
        self.postMessage({ error: 'Decryption failed: ' + e.message });
    }
};