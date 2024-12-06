// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rssFeedRoutes = require('./src/router/rssFeed.router');

const app = express();

// Middleware
app.use(express.json());
app.use('/api', rssFeedRoutes);

// MongoDB Connection - Version moderne
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`URL: http://localhost:${PORT}`);
});

module.exports = app;