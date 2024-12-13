const express = require('express');
const router = express.Router();
const rssFeedController = require('../controllers/rssFeed.controller');

router.get('/feeds', rssFeedController.getAllFeeds);
router.get('/feed/:id', rssFeedController.getFeed);
router.post('/feed', rssFeedController.createFeed);
router.put('/feed/:id', rssFeedController.updateFeed);
router.delete('/feed/:id', rssFeedController.deleteFeed);

module.exports = router;
/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     RssFeed:**
 *       type: object
 *       required:
 *         - title
 *         - url
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the RSS feed
 *         url:
 *           type: string
 *           description: The URL of the RSS feed
 *         description:
 *           type: string
 *           description: A description of the feed
 *         category:
 *           type: string
 *           description: The category of the feed
 *         isActive:
 *           type: boolean
 *           description: Whether the feed is active
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: When the feed was last updated
 * 
 * /api/feeds:
 *   get:
 *     summary: Get all RSS feeds
 *     responses:
 *       200:
 *         description: List of all RSS feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RssFeed'
 * 
 * /api/feed/{id}:
 *   get:
 *     summary: Get a specific RSS feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RSS feed details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RssFeed'
 * 
 *   put:
 *     summary: Update a RSS feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RssFeed'
 *     responses:
 *       200:
 *         description: Feed updated successfully
 * 
 *   delete:
 *     summary: Delete a RSS feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feed deleted successfully
 * 
 * /api/feed:
 *   post:
 *     summary: Create a new RSS feed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RssFeed'
 *     responses:
 *       201:
 *         description: Feed created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RssFeed'
 */