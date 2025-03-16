const express = require("express");
const router = express.Router();
const subscriptionsController = require("../controllers/subscriptions.controller");

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     description: Retrieve a list of all subscriptions.
 *     responses:
 *       200:
 *         description: A list of subscriptions.
 */
router.get("/", subscriptionsController.getAll);

/**
 * @swagger
 * /api/subscriptions/user/{userId}:
 *   get:
 *     summary: Get subscriptions by user ID
 *     description: Retrieve subscriptions for a specific user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve subscriptions for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of subscriptions for the specified user.
 *       404:
 *         description: Subscriptions not found.
 */
router.get("/user/:userId", subscriptionsController.getByUserId);

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     description: Create a new subscription.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               rssFeedId:
 *                 type: string
 *                 description: The ID of the RSS feed.
 *     responses:
 *       201:
 *         description: The newly created subscription.
 *       400:
 *         description: Bad request.
 */
router.post("/", subscriptionsController.create);

/**
 * @swagger
 * /api/subscriptions:
 *   delete:
 *     summary: Delete a subscription
 *     description: Delete a subscription.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               rssFeedId:
 *                 type: string
 *                 description: The ID of the RSS feed.
 *     responses:
 *       204:
 *         description: Subscription deleted successfully.
 *       404:
 *         description: Subscription not found.
 */
router.delete("/", subscriptionsController.delete);

module.exports = router;
