require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { swaggerOptions, swaggerUiOptions } = require('./src/config/swagger.config');

const app = express();

// Middleware de base
app.use(express.json());
app.use(express.static('public'));

// Initialisation de Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
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