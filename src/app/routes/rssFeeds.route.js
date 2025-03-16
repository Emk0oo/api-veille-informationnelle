const express = require("express");
const router = express.Router();
const rssFeedsController = require("../controllers/rssFeeds.controller");

router.get("/", rssFeedsController.getAll);
router.get("/last3", rssFeedsController.find3LastArticles);
router.get("/:id", rssFeedsController.getById);
router.get("/category/:category", rssFeedsController.getByCategory);
router.post("/", rssFeedsController.create);
router.put("/:id", rssFeedsController.updateById);
router.delete("/:id", rssFeedsController.deleteById);
router.get("/user/:userId", rssFeedsController.getAllFeedsForUser);

module.exports = router;
