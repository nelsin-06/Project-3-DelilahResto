const config = require('../config');
const PORT = config.SERVER.PORT;
const swaggerOptions = {
    definition: {
        openapi : "3.0.0",
        info: {
            title: "API - SPRINT PROJECT 3",
            version: "3.0.0",
            description: "SPRINT PROJECT 3 - ACAMICA-INTEGRACION CON AWS"
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                url: '../',
                description: "SERVER API"
            }
        ],
        components: {
            securitySchemes: {
                JWT: {
                    type: "http",
                    scheme: "bearer",
                    in: "header",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                JWT: [],
            }
        ]
    },
    apis: ["../src/route/*.js"]
};

module.exports = swaggerOptions;
