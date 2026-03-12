const { createConnection } = require('./');
module.exports = createConnection("test", process.env.DB_Test);
