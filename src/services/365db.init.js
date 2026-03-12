const { createConnection } = require('./db/index');
module.exports = createConnection("365", process.env.DB_365);
