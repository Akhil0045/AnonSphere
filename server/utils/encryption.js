const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

const encryptionKeyRaw = process.env.ENCRYPTION_KEY;
if (!encryptionKeyRaw) {
    console.error('CRITICAL ERROR: ENCRYPTION_KEY is missing in .env');
    process.exit(1);
}

const key = Buffer.from(encryptionKeyRaw, 'hex');
if (key.length !== 32) {
    console.error(`CRITICAL ERROR: ENCRYPTION_KEY must be 32 bytes (64 hex characters). Current length: ${key.length}`);
    process.exit(1);
}

const ivLength = 16;

const encrypt = (text) => {
    if (!text) return text;
    try {
        const iv = crypto.randomBytes(ivLength);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed'); // Fail hard
    }
};

const decrypt = (text) => {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        // If decryption fails (e.g., legacy/unencrypted data), return original text
        console.error('Decryption error (might be unencrypted data):', error.message);
        return text;
    }
};

module.exports = { encrypt, decrypt };
