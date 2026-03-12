const { createConnection } = require('./db/index');
module.exports = createConnection("test", process.env.DB_Test);
