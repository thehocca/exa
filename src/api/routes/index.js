(async function () {
    const console = require('tracer').colorConsole();
    const express = require('express');
    const app = express();
    const swaggerUi = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');
    const cors = require("cors");
    const helmet = require('helmet');
    const userAgent = require('express-useragent');
    const bodyParser = require("body-parser");
    const { components } = require('../../swagg/init');
    const { AttackBlokade } = require("../../helpers/secure_rest");

    // HTTP server
    const http = require('http').createServer(app);
    const server = http.listen(4007, () => {
        console.info('✅ Listening on port:', server.address().port);
    });

    // === Global middlewares ===
    app.use(helmet());
    app.use(cors({ origin: '*' }));
    app.use(userAgent.express());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.json());

    // Global error handler for invalid JSON
    app.use(function (err, req, res, next) {
        if (err.message.includes('ERR_HTTP_HEADERS_SENT')) return next();
        return res.status(501).json({
            success: false,
            message: "no_valid_json_sent"
        });
    });

    // === ROUTERS ===
    const systemRoutes = require('./system');

    const exaRoutes = require('./operator'); // ✅ yeni eklenen exa router

    // Mount routes
    app.use('/', systemRoutes);
    app.use('/', exaRoutes); // ✅ /exa/... altında çalışacak

    // === Swagger ===
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'WiseUp Gaming Provider API',
                version: '1.0.0',
                description: 'Unified Provider Layer (exa, GamingSoft, exa...)',
            },
            components: components,
            tags: [
                { name: 'system', description: 'Container / Health endpoints' },
                { name: 'operator', description: 'Operator integration endpoints' },
                { name: 'exa', description: 'exa integration endpoints' }
            ]
        },
        apis: ['./src/api/routes/**/*.js'],
    };

    const swaggerDocs = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    module.exports = { http, app };
})();
