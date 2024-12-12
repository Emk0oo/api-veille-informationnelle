require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rssFeedRoutes = require('./src/router/rssFeed.router');
const userRoutes = require('./src/router/user.router');
const authMiddleware = require('./src/middleware/auth.middleware');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware
app.use(express.json());
app.get('/', (req, res) => { res.send('Hello !'); });

app.use(authMiddleware);

app.use('/api', rssFeedRoutes);
app.use('/api', userRoutes);

// MongoDB Connection - Version moderne
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation de votre API',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
    },
    apis: ['./src/router/*.js'], // Chemin vers vos fichiers contenant des commentaires Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
