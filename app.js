(async () => {
    const console = require('tracer').colorConsole();
    await require("./src/config/system/init");
    const { clientInstance } = require("./src/services/client");

    console.info("Starting exa provider service...");

// MULTI DB INIT
    await require("./src/services/365db.init");
    await require("./src/services/Tipcoindb.init");
    await require("./src/services/Tipxdb.init");
    await require("./src/services/Tiptopdb.init");
    await require("./src/services/Starwindb.init");

    try {
        console.info("Routes loading...");
        await require('./src/api/routes');
        console.info("Routes loaded..");
    }
    catch (err) {
        console.error("Routes failed." + err);
    }
})();
