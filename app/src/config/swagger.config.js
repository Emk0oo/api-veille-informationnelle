// src/config/swagger.config.js
const path = require('path');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API RSS Reader',
            version: '1.0.0',
            description: 'API de gestion de flux RSS'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        servers: [
            {
                url: 'https://api-veille-informationelle.vercel.app',
                description: 'Production server'
            },
            {
                url: process.env.NODE_ENV === 'production' 
                    ? 'https://api-veille-informationelle.vercel.app' 
                    : `http://localhost:${process.env.PORT || 3001}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ]
    },
    apis: [path.join(__dirname, '../router/*.js')]
};

const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API RSS Reader Documentation",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        tryItOutEnabled: true,
        supportedSubmitMethods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']
    }
};

module.exports = {
    swaggerOptions,
    swaggerUiOptions
};