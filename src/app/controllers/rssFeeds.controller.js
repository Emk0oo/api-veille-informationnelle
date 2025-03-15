const { get } = require("mongoose");
const RssFeeds = require("../models/rssFeeds.model");
const Subscription = require("../models/subscriptions.model");
const RssFeed = require("../services/rssGetter");

exports.getAll = (req, res) => {
    RssFeeds.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving RssFeeds."
            });
        } else {
            res.status(200).send(data);
        }
    });
};

exports.getById = (req, res) => {
    RssFeeds.getById(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving RssFeeds."
            });
        } else {
            if (data.length === 0) {
                res.status(404).send({
                    message: "RssFeed not found."
                });
            } else {
                res.status(200).send(data[0]);
            }
        }
    });
};

exports.getByCategory = (req, res) => {
    RssFeeds.getByCategory(req.params.category, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving RssFeeds."
            });
        } else {
            res.status(200).send(data);
        }
    });
};

exports.create = (req, res) => {
    const { title, url, category } = req.body;

    const newRssFeed = new RssFeeds(null, title, url, category);

    RssFeeds.create(newRssFeed, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the RssFeed."
            });
        } else {
            res.status(201).send({message: "RssFeed sucessfully created." });
        }
    });
};

exports.updateById = (req, res) => {
    const { title, url, category } = req.body;

    const rssFeed = new RssFeeds(null, title, url, category);

    RssFeeds.updateById(req.params.id, rssFeed, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the RssFeed."
            });
        } else {
            if (data.affectedRows === 0) {
                res.status(404).send({
                    message: "RssFeed not found."
                });
            } else {
                res.status(200).send({message: "RssFeed sucessfully updated." });
            }
        }
    });
};

exports.deleteById = (req, res) => {
    RssFeeds.deleteById(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the RssFeed."
            });
        } else {
            if (data.affectedRows === 0) {
                res.status(404).send({
                    message: "RssFeed not found."
                });
            } else {
                res.status(200).send({message: "RssFeed sucessfully deleted." });
            }
        }
    });
};

exports.getAllFeedsForUser = async (req, res) => {
    const userId = req.params.userId;

    Subscription.getByUserId(userId, async (err, subscriptions) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving Subscriptions."
            });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).send({
                message: "No subscriptions found for this user."
            });
        }

        try {
            const feeds = [];
            
            for (const subscription of subscriptions) {
                const length = subscriptions.length;
                // console.log(subscription);

                let feedid = subscription.feed_id;
                try {
                    const data = await new Promise((resolve, reject) => {
                        RssFeeds.getById(feedid, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    });
                    
                    console.log(data);
                    for (const feed of data) {
                        try {
                            const rssFeed = await RssFeed.getRssFeed(feed.url);
                            feeds.push({
                                title: rssFeed.title,
                                items: rssFeed.items
                            });
                        } catch (error) {
                            console.error(`Error fetching RSS feed for ${feed.url}:`, error);
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching feed for ${feedid}:`, err);
                }
            }
            res.status(200).send(feeds);
        } catch (error) {
            console.error("Error fetching RSS feeds:", error);
            res.status(500).send({
                message: "Failed to retrieve RSS feeds."
            });
        }
    });
};

module.exports