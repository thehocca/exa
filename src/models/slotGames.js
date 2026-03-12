const { connections } = require("../services/db/index");
const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
    infos: {
        slotId: { type: String, required: true },
        no: { type: Number, required: true },
        name: { type: String, required: true },
        shortName: { type: String, required: true },
        providerId: { type: String, required: true },
        img: { type: String, required: true },
        desc: { type: String, default: "" },
        brand: { type: String, default: "" },
        active: { type: Boolean, default: true },
        tag: { type: String, default: "" },
        modes: { type: [mongoose.Schema.Types.Mixed], default: [] },
        languages: { type: [mongoose.Schema.Types.Mixed], default: [] },
        platforms: { type: [mongoose.Schema.Types.Mixed], default: [] },
        currencies: { type: [mongoose.Schema.Types.Mixed], default: [] }
    },
    stats: {
        spins: { type: Number, default: 0 },
        lost: { type: Number, default: 0 },
        win: { type: Number, default: 0 },
        pnl: { type: Number, default: 0 },
        live: { type: Number, default: 0 },
        oldData: { type: Object, default: {} }
    }
});

function getSlotModel(connName) {
    return connections[connName].model(
        "SlotGame",
        SlotSchema,
        "slots"
    );
}

module.exports = { getSlotModel };
