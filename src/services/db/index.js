const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const console = require('tracer').colorConsole();

require('dotenv').config({ path: './_env/apis.env' }).parsed;

const connections = {};

function createConnection(name, uri) {
    const conn = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    conn.on('connected', () => console.log(`[${name}] Mongo connected`));
    conn.on('error', (err) => console.log(`[${name}] Mongo error: ${err.message}`));
    conn.on('disconnected', () => console.log(`[${name}] Mongo disconnected`));

    connections[name] = conn;
    return conn;
}

module.exports = {
    connections,
    createConnection
};
