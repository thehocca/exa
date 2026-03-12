const { createConnection } = require('./db/index');
module.exports = createConnection("Starwin", process.env.DB_Starwin);
