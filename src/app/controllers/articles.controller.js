const Articles = require ('../models/articles.model');

// Retrieve all articles from the database.
exports.findAll = (req, res) => {
    Articles.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occurred while retrieving articles."
            });
        } else {
            res.send(data);
        }
    });
};

//Retrieve all by date 


// Find a single article with an articleId
exports.findOne = (req, res) => {
    Articles.getById(req.params.articleId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Article with id ${req.params.articleId} not found.`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving article with id ${req.params.articleId}`
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Find all articles for a given feedId
exports.findByFeedId = (req, res) => {
    Articles.getByFeedId(req.params.feedId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Articles with feed_id ${req.params.feedId} not found.`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving articles with feed_id ${req.params.feedId}`
                });
            }
        } else {
            res.send(data);
        }
    });
};

