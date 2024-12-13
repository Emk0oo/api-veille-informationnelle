require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();

// Middleware de base
app.use(express.json());
app.use(express.static('public'));

// Configuration Swagger
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
                url: `http://localhost:${process.env.PORT || 3001}`,
                description: 'Development server'
            }
        ]
    },
    apis: [path.join(__dirname, './src/router/*.js')] // Utilisation de path.join pour les chemins
};

// Initialisation de Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Configuration de Swagger UI
const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API RSS Reader Documentation",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true
    }
};

// Route Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocs, swaggerUiOptions));

// Route publique
app.get('/', (req, res) => { 
    res.send('Hello !'); 
});

// Routes d'authentification (non protégées)
const authRoutes = require('./src/router/auth.router');
app.use('/auth', authRoutes);

// Middleware d'authentification pour les routes protégées
const authMiddleware = require('./src/middleware/auth.middleware');
app.use('/api', authMiddleware);

// Routes protégées
const rssFeedRoutes = require('./src/router/rssFeed.router');
const userRoutes = require('./src/router/user.router');
app.use('/api', rssFeedRoutes);
app.use('/api', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;