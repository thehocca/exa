// helpers/cache.js
const cache = new Map();

/**
 * Veriyi cache'e ekler
 * @param {string} key
 * @param {*} value
 * @param {number} ttlMs - milisaniye cinsinden geçerlilik süresi (örn. 10dk = 600000)
 */
function set(key, value, ttlMs = 600000) {
    const expiresAt = Date.now() + ttlMs;
    cache.set(key, { value, expiresAt });

    // TTL süresi sonunda otomatik temizleme
    setTimeout(() => {
        if (cache.has(key) && cache.get(key).expiresAt <= Date.now()) {
            cache.delete(key);
        }
    }, ttlMs + 5000); // küçük bir buffer ekledik
}

function get(key) {
    const entry = cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt <= Date.now()) {
        cache.delete(key);
        return null;
    }
    return entry.value;
}

function has(key) {
    const entry = cache.get(key);
    if (!entry) return false;

    if (entry.expiresAt <= Date.now()) {
        cache.delete(key);
        return false;
    }
    return true;
}

function del(key) {
    cache.delete(key);
}

function clear() {
    cache.clear();
}

module.exports = {
    set,
    get,
    has,
    delete: del,
    clear
};
