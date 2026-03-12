const mongoose = require("mongoose");

const SchemaRSK = {
    Product: { type: String},
    ProductCode: { type: String },
    GameType:{
        name: { type: String },
        id: { type: String }
    },
    CurrencyCode: { type: String },
    ConversationRate: { type: Number }
};

const Providers = mongoose.model('exa_providers', new mongoose.Schema(SchemaRSK));

module.exports = {
    Providers,
    SchemaRSK,
};
