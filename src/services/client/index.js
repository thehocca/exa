// controllers/ClientController.js
const { redisTiptopwin }  = require('../redisClient/tiptopwin_redis');
const { redis365 }        = require('../redisClient/365_redis');
const { redisTipx }       = require('../redisClient/tipx_redis');
const { redisTipCoin }       = require('../redisClient/tipcoin_redis');
const { redisStarwin }       = require('../redisClient/starwin_redis');

class ClientController {
    constructor() {
        if (!ClientController.instance) {
            // RAM cache
            this.Users       = new Map(); // id -> { balance, Beforebalance?, currency? }
            this.WhichRedis  = new Map(); // token -> "tiptopwin" | "betip365" | "tipxpro" | "default"
            this.UserFilters = new Map();
            this.UserStake = new Map();
            this.UserPlayBrand = new Map();
            this.UserPlayType = new Map();
            this.LaunchTokens = new Map();
            this.UserNames = new Map();

            ClientController.instance = this;
        }
        return ClientController.instance;
    }

    setLaunchToken(token, userId,currency,GameName,
                   SlotID) {
        const fallbackDomain = this.getWhichRedis(userId); // ihtiyat, eski kullanım kalmış olabilir
        const domain = this.extractDomainName(fallbackDomain || 'default');
        this.LaunchTokens.set(token, { userId,currency,domain,GameName,
            SlotID});
    }

    // EXA authenticate → token’dan userId çek
    getUserFromLaunchToken(token) {
        return this.LaunchTokens.get(token);
    }

    clearUsersId(id) {
        this.Users.delete(id);
        this.UserFilters.delete(id);
        this.UserPlayBrand.delete(id);
        this.UserPlayType.delete(id);
        this.WhichRedis.delete(id);
        this.UserNames.delete(id);
        this.UserStake.delete(id);
    }

    isExists(id) {
        return this.Users.has(id);
    }

    getUserName(id) {
        return this.UserNames.get(id) || "noNick";
    }



    setWhichRedis(id, domain) { this.WhichRedis.set(id, domain); }
    getWhichRedis(id)         { return this.WhichRedis.get(id); }

    // ---------- Bonus ----------
    getBonusStake(bonus, whichBonus) {
        if (!bonus?.activeBonuses?.length) return 0;
        const bn = bonus.activeBonuses.find(b => b?.title === whichBonus);
        return bn ? bn.balance : 0;
    }

    // ---------- Limits ----------
    decodeBetLimit(limitsData, gameId, brandId, providerId = 'gamingsoft', productType = 'casino') {
        const limits = limitsData;
        if (!limits) return { minBet: 0, maxBet: 0 };

        if (limits[gameId])    return limits[gameId];
        if (limits[brandId])   return limits[brandId];
        if (limits[providerId]) return limits[providerId];

        return limits.global || { minBet: 0, maxBet: 0 };
    }

    // ---------- User Filters ----------
    async getUserFilter(id) {
        try {
            // 🔹 1. RAM cache kontrolü
            if (this.UserFilters.has(id)) {
                return this.UserFilters.get(id);
            }

            // 🔹 2. Domain tespiti (id veya token’dan)
            let domain = this.getWhichRedis(id) || "default";
            domain = this.extractDomainName(domain);

            // 🔹 3. Redis client seçimi
            const redisClient = this._getRedisClient(domain);

            // 🔹 4. Redis'ten kullanıcı verisini çek
            const raw = await redisClient.getUSER(id);
            if (!raw) {
                console.warn(`⚠️ getUserFilter: Redis'te kullanıcı bulunamadı (id=${id}, domain=${domain})`);
                return null;
            }

            let json;
            try {
                json = JSON.parse(raw);
            } catch (err) {
                console.error(`❌ getUserFilter: JSON parse hatası (id=${id})`, err.message);
                return null;
            }

            // 🔹 5. Filtreleri al
            const filters = json?.USERDATA?.filters?.games || [];

            // 🔹 6. RAM cache'e yaz
            this.UserFilters.set(id, filters);

            // 🔹 7. Dönüş
            return filters;
        } catch (err) {
            console.error(`❌ getUserFilter: Beklenmeyen hata (id=${id})`, err.message);
            return null;
        }
    }

     fixExa = (n) => Number(n.toFixed(2));


    // ---------- Balance: Public ----------
    async getBalance(id) {
        // Fast path: cache & token match
        if (this.Users.has(id)) {
                return this.fixExa(this._getBalance(id));
        }

        // Domain seçiminde öncelik token -> (gerekirse token yerine id denenir)
        const fallbackDomain = this.getWhichRedis(id); // ihtiyat, eski kullanım kalmış olabilir
        const domain = this.extractDomainName(fallbackDomain || 'default');

        // İlgili redis’ten veriyi getir + RAM’e koy
        const ok = await this._hydrateUserFromRedis(domain, id);
        if (!ok) return null;

        return this.fixExa(this._getBalance(id));
    }

    async setBalance(id, beforeBalance, balance) {
        const finance = this.Users.get(id);
        if (finance && typeof finance.balance !== 'undefined') {
            return this._setBalance(finance, beforeBalance, balance);
        } else {
            console.warn(`⚠️ setBalance başarısız: user ${id} için finansal veri yok.`);
            return undefined;
        }
    }

    // ---------- Publish ----------
    async publishMessage(data) {
        const fallbackDomain = this.getWhichRedis(data.userId); // ihtiyat, eski kullanım kalmış olabilir
        const domain = this.extractDomainName(fallbackDomain || 'default');

        const payload = JSON.stringify(data);
        const redis = this._getRedisClient(domain);

        await redis.publishMessage('exa', payload);
    }

    async publishNoBet(data,exit=false,payload=null,message="No Allowed Bet",msgid="no_bet_allow") {
        const messagex={"id":data,"message":message,"msgid":msgid,"exit":exit,"min":payload?.min,"max":payload?.max}
        const fallbackDomain = this.getWhichRedis(data); // ihtiyat, eski kullanım kalmış olabilir
        const domain = this.extractDomainName(fallbackDomain || 'default');


        const redis = this._getRedisClient(domain);

        await redis.publishMessage('noBet',  JSON.stringify(messagex));
    }

    // ---------- Internal helpers ----------
    _getBalance(id) {
        const v = this.Users.get(id)?.balance;
        return typeof v === 'number' ? v : Number(v);
    }

    _setBalance(financeObj, beforeBalance, balance) {
        financeObj.Beforebalance = typeof beforeBalance === 'number' ? beforeBalance : Number(beforeBalance);
        financeObj.balance       = typeof balance === 'number' ? balance : Number(balance);
        return financeObj.balance;
    }

    extractDomainName(input) {
        if (!input || typeof input !== 'string') return 'default';
        const lower = input.toLowerCase();
        if (lower.includes('tiptopwin')) return 'tiptopwin';
        if (lower.includes('betip365'))  return 'betip365';
        if (lower.includes('tipxpro'))   return 'tipxpro';
        if (lower.includes('tipcoin365'))   return 'tipcoin';
        if (lower.includes('starwin724'))   return 'starwin';
        return 'starwin';
    }

    _getRedisClient(domain) {
        switch (domain) {
            case 'tiptopwin': return redisTiptopwin;
            case 'betip365' : return redis365;
            case 'tipxpro'  : return redisTipx;
            case 'tipcoin'  : return redisTipCoin;
            case 'starwin'  : return redisStarwin;
            default         : return redisTipx; // ← düzeltildi (eskiden tiptopwin’e düşüyordu)
        }
    }

    setStakeFrom(id, stakeFrom) {
        this.UserStake.set(id, stakeFrom);
    }

    getStakeFrom(id) {
        return this.UserStake.get(id);
    }


    async _hydrateUserFromRedis(domain, id) {
        const redis = this._getRedisClient(domain);

        let raw;
        try {
            raw = await redis.getUSER(id);
        } catch (e) {
            console.warn(`⚠️ Redis getUSER hata (domain=${domain}, id=${id}):`, e?.message || e);
            return false;
        }
        if (!raw) return false;

        let json;
        try {
            json = JSON.parse(raw);
        } catch (e) {
            console.warn(`⚠️ JSON parse hata (id=${id}):`, e?.message || e);
            return false;
        }

        const userData = json?.USERDATA || {};
        const finance  = userData.finance || {};
        const bonus    = userData.bonus;
        this.UserNames.set(id, userData.personal.nickname);
        const stakeFrom = this.getStakeFrom(id);
        const useFinance = !stakeFrom || stakeFrom === 'finance.balance';
        const balanceVal = useFinance
            ? finance.balance
            : this.getBonusStake(bonus, stakeFrom);

        // RAM cache’e normalize edilerek yaz
        const normalized = {
            ...finance,
            balance: typeof balanceVal === 'number' ? balanceVal : Number(balanceVal) || 0
        };

        this.Users.set(id, normalized);

        return true;
    }
}

const clientInstance = new ClientController();
module.exports = { clientInstance };
