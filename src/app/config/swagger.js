const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for all API endpoints',
    },
  },
  apis: [
    path.join(__dirname, '../routes/auth.route.js'),
    path.join(__dirname, '../routes/rssFeeds.route.js'),
    path.join(__dirname, '../routes/subscriptions.route.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
