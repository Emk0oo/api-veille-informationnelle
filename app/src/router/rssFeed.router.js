const express = require('express');
const router = express.Router();
const rssFeedController = require('../controllers/rssFeed.controller');

// Assurez-vous que ces méthodes existent dans votre controller
router.get('/feeds', rssFeedController.getAllFeeds);
router.get('/feed/:id', rssFeedController.getFeed);
router.post('/feed', rssFeedController.createFeed);
router.put('/feed/:id', rssFeedController.updateFeed);
router.delete('/feed/:id', rssFeedController.deleteFeed);

module.exports = router;