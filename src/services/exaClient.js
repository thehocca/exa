const crypto = require("crypto");
const {clientInstance} = require("./client");


const AES_KEY = process.env.exa_AES_KEY;         // 🔹 AES anahtarın

// === AES ENCRYPT/DECRYPT ===
function aesEncrypt(plainText) {
    const key = Buffer.from(AES_KEY, "utf8");
    const cipher = crypto.createCipheriv(`aes-${key.length * 8}-ecb`, key, null);
    cipher.setAutoPadding(true);
    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
    return encrypted.toString("base64");
}

function aesDecrypt(base64Cipher) {
    const key = Buffer.from(AES_KEY, "utf8");
    const decipher = crypto.createDecipheriv(`aes-${key.length * 8}-ecb`, key, null);
    decipher.setAutoPadding(true);
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(base64Cipher, "base64")),
        decipher.final()
    ]);
    return decrypted.toString("utf8");
}

// === UTILS ===
function timestampMs() {
    return Date.now().toString();
}


// === EXPORTS ===
module.exports = {
    aesEncrypt,
    aesDecrypt
};
