const { createConnection } = require('./db/index');
module.exports = createConnection("Tipx", process.env.DB_Tipx);
