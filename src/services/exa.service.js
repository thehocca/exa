const axios = require("axios");
const { clientInstance } = require("../services/client/index");
const crypto = require("crypto");

const DEBUG = process.env.EXA_DEBUG === "true";

function debugLog(...args) {
    if (DEBUG) {
        const ts = new Date().toISOString();
        console.log(`[EXA-SERVICE ${ts}]`, ...args);
    }
}

async function getGameList() {
    const operatorId = process.env.EXA_OPERATOR_ID;        // 238
    const API        = process.env.EXA_API;            // https://user-api.exagaming.com

    const url = `${API}/api/v1/operator/${operatorId}/game-list`;

    debugLog("➡️ Fetching EXA GAME LIST:", url);

    const { data } = await axios.get(url);

    debugLog("⬅️ EXA GAME LIST RESPONSE:", data);

    // Dokümandaki response: { data: [ {id, gameCategory, launchUrl, ...}, ... ] }
    // :contentReference[oaicite:2]{index=2}
    return data.data;
}


async function authenticate  ({ token }) {
    debugLog("Authenticationc callback TOKEN", token);
    const session = clientInstance.getUserFromLaunchToken(token);

    if (!session) {
        const err = new Error("Session not found");
        err.code = 1;
        throw err;
    }

    debugLog("Authenticationc callback session", session);

    const { userId,currency } = session;

    // domain değişkeni artık doğru Redis’i seçecek

    const balance = await clientInstance.getBalance(userId);

    debugLog("Authenticationc callback balance", balance);

    debugLog("Authenticationc callback reponse JSON",  {
        user: {
            id: String(userId),
            userName: String(userId),
            firstName: String(clientInstance.getUserName(userId)),
            lastName: ""
        },
        wallet: {
            currency: currency,
            balance
        }
    });

    return {
        user: {
            id: String(userId),
            userName: String(userId),
            firstName: String(clientInstance.getUserName(userId)),
            lastName: ""
        },
        wallet: {
            currency: currency,
            balance
        }
    };
};

async function bet  (body)  {
    debugLog("bet callback ", body);

    const {user,amount,gameId,roundId,transactionId,currencyCode,betId } = body;

    const session = clientInstance.getUserFromLaunchToken(user.token);

    if (!session) {
        const err = new Error("Session not found");
        err.code = 1;
        throw err;
    }

    const userID = user.id;

    const exists =  clientInstance.isExists(userID);
    if (!exists) {
        const err = new Error("User not found");
        err.code = 1;
        throw err;
    }

    const { userId,currency,GameName, SlotID } = session;

    if (userId !== userID) {
        const err = new Error("User and Session different");
        err.code = 1;
        throw err;
    }

    const balance = await clientInstance.getBalance(userID);

    if (balance < amount) {
        const err = new Error("Insufficient funds");
        err.code = 2;
        throw err;
    }

    const before = balance;
    const after = balance - amount;

    await clientInstance.setBalance(userID, before, after);

    await clientInstance.publishMessage({
        type: "bet",
        user,
        betId,
        gameId,
        amount,
        roundId,
        currencyCode,
        transactionId,
        beforeBalance: before,
        afterBalance: after,
        stakeFrom:clientInstance.getStakeFrom(userID),
        GameName,
        SlotID
    });

    return {
        wallet: { currency: currency, balance: after }
    };
};

async function win (body)  {
    debugLog("win callback ", body);

    const { user, amount ,gameId,roundId,transactionId,debitTransactionId,betId,currencyCode} = body;

    const session = clientInstance.getUserFromLaunchToken(user.token);

    if (!session) {
        const err = new Error("Session not found");
        err.code = 1;
        throw err;
    }

    const userID = user.id;

    const exists = await clientInstance.isExists(userID);
    if (!exists) {
        const err = new Error("User not found");
        err.code = 1;
        throw err;
    }

    const { userId,currency,GameName,
        SlotID } = session;

    if (userId !== userID) {
        const err = new Error("User and Session different");
        err.code = 1;
        throw err;
    }

    const balance = await clientInstance.getBalance(userID);
    const before = balance;
    const after = balance + amount;

    await clientInstance.setBalance(userID, before, after);

    await clientInstance.publishMessage({
        type: "win",
        user,
        amount,
        beforeBalance: before,
        afterBalance: after,
        gameId,roundId,transactionId,debitTransactionId,betId,currencyCode,
        stakeFrom:clientInstance.getStakeFrom(userID),GameName, SlotID
    });

    return {
        wallet: { currency:  currency, balance: after }
    };
};

async function rollback  (body) {
    debugLog("rollback callback", body);

    const {user, amount,gameId,roundId,originalTransactionId,rollbackTransactionId,betId,currencyCode} = body;

    const session = clientInstance.getUserFromLaunchToken(user.token);

    if (!session) {
        const err = new Error("Session not found");
        err.code = 1;
        throw err;
    }


    const userID = user.id;

    const exists = await clientInstance.isExists(userID);
    if (!exists) {
        const err = new Error("User not found");
        err.code = 1;
        throw err;
    }

    const { userId,currency,GameName, SlotID } = session;

    if (userId !== userID) {
        const err = new Error("User and Session different");
        err.code = 1;
        throw err;
    }


    const balance = await clientInstance.getBalance(userID);
    const before = balance;
    const after = balance + amount;

    await clientInstance.setBalance(userID, before, after);

    await clientInstance.publishMessage({
        type: "rollback",
        user,
        amount,
        beforeBalance: before,
        afterBalance: after,
        gameId,roundId,originalTransactionId,rollbackTransactionId,betId,currencyCode,
        stakeFrom:clientInstance.getStakeFrom(userID),
        GameName,
        SlotID
    });

    return {
        wallet: {currency: currency, balance: after}
    };
}

async function funds  ({ token })  {
    debugLog("funds callback ", token);

    const session = clientInstance.getUserFromLaunchToken(token);

    if (!session) {
        const err = new Error("Session not found");
        err.code = 1;
        throw err;
    }

    const { userId,currency } = session;

    const balance = await clientInstance.getBalance(userId);
    debugLog("funds response ", {
        wallet: {
            currency: currency,
            balance
        }
    });

    return {
        wallet: {
            currency: currency,
            balance
        }
    };
};

async function launchGame({ userId, gameId, currency="USD", lang="tr", domain,stakeFrom,GameName,
                              SlotID }) {


    // 2️⃣ Token üret
    const raw = `${userId}-${Date.now()}-${Math.random()}`;
    const token = crypto.createHash("sha256").update(raw).digest("hex");

    // 5️⃣ EXA launch URL üret
    const OP = process.env.EXA_OPERATOR_ID;
    const payload = {
        gameId: Number(gameId),
        token,
        currency,
        operator: Number(OP),
        lang
    };
    let exaResp;

    debugLog("LAUNSH GAME PAYLOAD", payload);
    try {
        exaResp = await axios.post(
            "https://api.exagaming.com/api/v1/game/launch",
            payload,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 5000
            }
        );
    } catch (err) {
        console.error("EXA launch error:", err.response?.data || err.message);
        throw new Error("EXA launch failed");
    }

    if (
        !exaResp.data ||
        exaResp.data.status.toString().toLowerCase() !== "success" ||
        !exaResp.data.data?.launchUrl
    ) {
        console.error("Invalid EXA response:", exaResp.data);
        return{status:-1,launchUrl:null}
        throw new Error("Invalid EXA launch response");
    }

    // 3️⃣ Token → ClientController RAM’e yaz
    clientInstance.clearUsersId(userId);
    clientInstance.setWhichRedis(userId,domain)
    clientInstance.setLaunchToken(token, userId,currency,GameName,
        SlotID);
    clientInstance.setStakeFrom(userId,stakeFrom)
    // 4️⃣ Kullanıcı oynadığı marka & türü RAM’e yaz
    clientInstance.getBalance(userId);

    debugLog("LAUNSH GAME URL", exaResp.data.data.launchUrl);


    // 5️⃣ Net çıktı
    return {
        status:200,
        launchUrl: exaResp.data.data.launchUrl
    };
}

module.exports = {
    launchGame,
    authenticate,
    bet,
    win,
    rollback,
    funds,
    getGameList,
};
