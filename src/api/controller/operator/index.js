const service = require("../../../services/exa.service");
const response = require("../../../helpers/response");
const DEBUG = process.env.EXA_DEBUG === "true";
const {connections} = require("../../../services/db");

function debugLog(...args) {
    if (DEBUG) {
        const ts = new Date().toISOString();
        console.log(`[EXA-CTRL ${ts}]`, ...args);
    }
}

exports.fetchGameList = async (req, res) => {
    try {
        debugLog("Fetching game list…");
        const client = (req.query.client || "Test");

        const data = await service.getGameList();

        if (!data ||data.length===0) {
            return res.status(200).json({ ok: false, msg: "No games" });
        }

        const liveBatch = [];

        for (const g of data.filter(g=>g.gameCategory==="live_game")) {
            const base = {
                pointer: g.id,
                brand: "Exa",
                brandId: "Exa",
                name: g.name,
                providerId: "Exa",
                gameId: g.launchUrl,
                active: g.isActive,
                imageUrl:g.thumbnailUrl,
                category: "Exa Casino",
                type: g.gameCategory,
                tag: g.gameCategory.toUpperCase(),
                modes: [],
                languages: [],
                platforms: [],
                currencies: ["USD","CHF","TR","EUR","USDT"]
            };
            liveBatch.push({
                infos: base,
                stats: {}
            });
        }

        const slotBatch = [];

        for (const g of data.filter(g=>g.gameCategory==="slot_game")) {
            const base = {
                pointer: g.id,
                brand: "Exa",
                brandId: "Exa",
                name: g.name,
                providerId: "Exa",
                slotId: g.launchUrl.replace("/",""),
                active: g.isActive,
                imageUrl:"https://casino.galadrex.com/assets/img/slot/e/exa/"+g.name,
                category: "Exa Slot",
                type: g.gameCategory,
                tag: g.gameCategory.toUpperCase(),
                modes: [],
                sortNum:0,
                languages: [],
                platforms: [],
                currencies: ["USD","CHF","EUR","TR","USDT"]
            };

            slotBatch.push({
                infos: base,
                stats: {}
            });
        }

        const dbNames = Object.keys(connections);
        console.log("dbNames", dbNames);

               for (const dbName of dbNames) {
                   if(dbName===client) {
                       const db = connections[client];

                       const casinos = db.db.collection("casinos");
                       const slots = db.db.collection("slots");

                       await casinos.deleteMany({ "infos.providerId": "Exa" });
                       if (liveBatch.length) await casinos.insertMany(liveBatch, { ordered: false });

                       await slots.deleteMany({ "infos.providerId": "Exa" });
                       if (slotBatch.length) await slots.insertMany(slotBatch, { ordered: false });

                   }
               }


        return res.status(200).json(response.ok({
            casinoData: liveBatch,
            casinoCount: liveBatch.length,
            slotData: slotBatch,
            slotCount: slotBatch.length
        }));



    } catch (err) {
        debugLog("🔥 ERROR:", err.message);
        return res.status(500).json({ ok: false, error: err.message });
    }
};

exports.ping = (req, res) => {
    debugLog("🏓 Ping received");
    res.status(200).send("EXA OK");
};

exports.authenticate = async (req, res) => {
    try {
        debugLog("Authenticationc callback start", req.body);
        const data = await service.authenticate(req.body);
        debugLog("Authenticationc callback response",data);

        return res.status(200).json(response.ok(data));
    } catch (err) {
        return res.status(200).json(response.err(err));
    }
};

exports.bet = async (req, res) => {
    debugLog("bet callback start", req.body);

    return   res.status(200).json(
        response.ok(await service.bet(req.body))
    );
}
exports.win = async (req, res) => {
    debugLog("win callback start", req.body);

    return   res.status(200).json(
        response.ok(await service.win(req.body))
    );
}
exports.rollback = async (req, res) => {
    debugLog("rollback callback start", req.body);

    return   res.status(200).json(
        response.ok(await service.rollback(req.body))
    );
}
exports.funds = async (req, res) => {
    debugLog("funds callback start", req.body);

    return   res.status(200).json(
        response.ok(await service.funds(req.body))
    );
}
exports.gameClose = async (req, res) => {
    debugLog("gameClose callback start", req.body);

    return   res.status(200).json(response.ok({}));
}

exports.launchGame = async (req, res) => {
    try {
        const {
            UserID,
            MemberName,
            DisplayName,
            Password,
            ProductID,
            GameID,
            GameName,
            SlotID,
            GameType,
            Currency,
            LanguageCode,
            Platform,
            IPAddress,
            stakeFrom,
            returnUrl,
            type
        } = req.body;

        console.log(req.body);

        if (!UserID || !GameID) {
            return res.status(200).json({ ok:false, msg:"Missing fields (userId, gameId required)" });
        }

        const url = await service.launchGame({ userId:UserID, gameId:GameID, currency:Currency, lang:LanguageCode,domain:returnUrl ,stakeFrom,GameName,
            SlotID});

        if(url.status!==-1) {

            return res.status(200).json({ok: true, url: url.launchUrl});
        }else{
            return res.status(500).json({ ok:false, error: err.message });
        }

    } catch (err) {
        return res.status(500).json({ ok:false, error: err.message });
    }
};

