const express = require("express");
const router = express.Router();
const rssFeedsController = require("../controllers/rssFeeds.controller");

/**
 * @swagger
 * /api/rssFeeds:
 *   get:
 *     summary: Get all RSS feeds
 *     description: Retrieve a list of all RSS feeds.
 *     responses:
 *       200:
 *         description: A list of RSS feeds.
 */
router.get("/", rssFeedsController.getAll);

/**
 * @swagger
 * /api/rssFeeds/last3:
 *   get:
 *     summary: Get the last 3 RSS feeds
 *     description: Retrieve the last 3 RSS feeds.
 *     responses:
 *       200:
 *         description: A list of the last 3 RSS feeds.
 */
router.get("/last3", rssFeedsController.find3LastArticles);

/**
 * @swagger
 * /api/rssFeeds/{id}:
 *   get:
 *     summary: Get an RSS feed by ID
 *     description: Retrieve an RSS feed by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the RSS feed to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The RSS feed with the specified ID.
 *       404:
 *         description: RSS feed not found.
 */
router.get("/:id", rssFeedsController.getById);

/**
 * @swagger
 * /api/rssFeeds/category/{category}:
 *   get:
 *     summary: Get RSS feeds by category
 *     description: Retrieve RSS feeds by their category.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: The category of the RSS feeds to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of RSS feeds with the specified category.
 *       404:
 *         description: RSS feeds not found.
 */
router.get("/category/:category", rssFeedsController.getByCategory);

/**
 * @swagger
 * /api/rssFeeds:
 *   post:
 *     summary: Create a new RSS feed
 *     description: Create a new RSS feed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the RSS feed.
 *               category:
 *                 type: string
 *                 description: The category of the RSS feed.
 *     responses:
 *       201:
 *         description: The newly created RSS feed.
 *       400:
 *         description: Bad request.
 */
router.post("/", rssFeedsController.create);

/**
 * @swagger
 * /api/rssFeeds/{id}:
 *   put:
 *     summary: Update an RSS feed by ID
 *     description: Update an existing RSS feed by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the RSS feed to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the RSS feed.
 *               category:
 *                 type: string
 *                 description: The category of the RSS feed.
 *     responses:
 *       200:
 *         description: The updated RSS feed.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: RSS feed not found.
 */
router.put("/:id", rssFeedsController.updateById);

/**
 * @swagger
 * /api/rssFeeds/{id}:
 *   delete:
 *     summary: Delete an RSS feed by ID
 *     description: Delete an existing RSS feed by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the RSS feed to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: RSS feed deleted successfully.
 *       404:
 *         description: RSS feed not found.
 */
router.delete("/:id", rssFeedsController.deleteById);

/**
 * @swagger
 * /api/rssFeeds/user/{userId}:
 *   get:
 *     summary: Get all RSS feeds for a user
 *     description: Retrieve a list of all RSS feeds for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve RSS feeds for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of RSS feeds for the specified user.
 *       404:
 *         description: RSS feeds not found.
 */
router.get("/user/:userId", rssFeedsController.getAllFeedsForUser);

/**
 * @swagger
 * /api/rssFeeds/user/{userId}/articles/{date}:
 *   get:
 *     summary: Get all articles for a user's subscriptions on a specific date
 *     description: Retrieve a list of all articles for a specific user's subscriptions on a specific date.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve articles for.
 *         schema:
 *           type: string
 *       - in: path
 *         name: date
 *         required: true
 *         description: The date to retrieve articles for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of articles for the specified user and date.
 *       404:
 *         description: Articles not found.
 */
router.get("/user/:userId/articles/:date", rssFeedsController.getArticlesByUserIdAndDate);

module.exports = router;
