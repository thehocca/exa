// services/idempotency.js (örnek Redis-based)
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

async function reserveTransaction(user_id, txid, fingerprint, ttlMs = 10 * 60 * 1000) {
    // fingerprint: JSON.stringify(sorted req.data) gibi; identical requestlerde aynısı gelir
    const key = `idem:${user_id}:${txid}`;
    const res = await redis.set(key, fingerprint, "NX", "PX", ttlMs);
    return res === "OK"; // true -> ilk kez işlendi
}

async function getTransactionFingerprint(user_id, txid) {
    return await redis.get(`idem:${user_id}:${txid}`);
}

module.exports = { reserveTransaction, getTransactionFingerprint };
