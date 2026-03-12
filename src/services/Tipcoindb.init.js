const { createConnection } = require('./db/index');
module.exports = createConnection("TipCoin", process.env.DB_Tipcoin);
