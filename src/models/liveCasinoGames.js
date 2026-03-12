const { connections } = require("../services/db/index");
const mongoose = require("mongoose");

const LiveCasinoSchema = new mongoose.Schema({
    infos: {
        pointer: String,
        brand: String,
        brandId: String,
        name: String,
        providerId: { type: String, required: true },
        gameId: String,
        active: Boolean,
        imageUrl: String,
        category: String,
        type: String,
        tag: { type: String, default: "hot" },
        modes: { type: [mongoose.Schema.Types.Mixed], default: [] },
        languages: { type: [mongoose.Schema.Types.Mixed], default: [] },
        platforms: { type: [mongoose.Schema.Types.Mixed], default: [] },
        currencies: { type: [mongoose.Schema.Types.Mixed], default: [] }
    },
    stats: {
        trx: { type: Number, default: 0 },
        lost: { type: Number, default: 0 },
        win: { type: Number, default: 0 },
        pnl: { type: Number, default: 0 },
        live: { type: Number, default: 0 },
        oldData: { type: Object, default: {} }
    }
});

// 🔥 Multi-DB model getter
function getLiveCasinoModel(connName) {

    return connections[connName].model(
        "LiveCasino",
        LiveCasinoSchema,
        "casinos" // collection adı
    );
}

module.exports = { getLiveCasinoModel };
