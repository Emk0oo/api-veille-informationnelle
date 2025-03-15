const RssFeeds = require("../models/rssFeeds.model");

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