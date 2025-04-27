const { get } = require("mongoose");
const RssFeeds = require("../models/rssFeeds.model");
const Subscription = require("../models/subscriptions.model");
const RssFeed = require("../services/rssFeeds.service");
const Articles = require("../models/articles.model");

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

//Retrieve 3 last articles from the database

exports.find3LastArticles = (req, res) => {
    Articles.get3LastArticles((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occurred while retrieving articles."
            });
        } else {
            res.send(data);
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
    const { title, url, category_id } = req.body;

    const newRssFeed = new RssFeeds(null, title, url, category_id);

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

                    // console.log(data);
                    for (const feed of data) {
                        console.log(feed);
                        try {
                            const rssFeed = await RssFeed.getRssFeed(feed.url);
                            console.log(`Retrieved RSS feed: ${feed.url}, found ${rssFeed.items.length} articles, adapter provided: ${feed.adapter_name}`);

                            const adapter = require(`../rss-adapters/${feed.adapter_name}`);
                            const parsedFeed =  adapter.parse(rssFeed);
                            // console.log(parsedFeed);
                            // console.log(adapter.parse(rssFeed));
                            feeds.push({
                                feed_id: feed.id,
                                category_id: feed.category_id,
                                title: rssFeed.title,
                                items: parsedFeed.items,
                            });
                            // console.log('feeds', feeds);
                        } catch (error) {
                            console.error(`Error fetching RSS feed for ${feed.url}:`, error);
                        }
                    }

                } catch (err) {
                    console.error(`Error fetching feed for ${feedid}:`, err);
                }
            }
            RssFeed.createArticles(feeds); //A DECOMMENTER SI ON VEUT CREER LES ARTICLES A PARTIR DES FEEDS RECUPERES
            res.status(200).send(feeds);
        } catch (error) {
            console.error("Error fetching RSS feeds:", error);
            res.status(500).send({
                message: "Failed to retrieve RSS feeds."
            });
        }
    });
};

exports.getArticlesByUserIdAndDate = (req, res) => {
    const userId = req.params.userId;
    const date = req.params.date;

    Subscription.getByUserId(userId, (err, subscriptions) => {
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

        const feedIds = subscriptions.map(subscription => subscription.feed_id);

        Articles.getArticlesByFeedIdAndPublishedAt(feedIds, date, (err, articles) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Articles."
                });
            }

            res.status(200).send(articles);
        });
    });
};

module.exports
