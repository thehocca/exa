const { createConnection } = require('./db/index');
module.exports = createConnection("Tiptop", process.env.DB_Tiptop);
