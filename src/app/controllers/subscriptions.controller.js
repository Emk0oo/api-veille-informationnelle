const Subscription = require('../models/subscriptions.model');

exports.create = (req, res) => {
    const { userId, feedId } = req.body;

    const newSubscription = new Subscription(null, userId, feedId);

    Subscription.create(newSubscription, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Subscription."
            });
        } else {
            res.status(201).send({message: "Subscription sucessfully created." });
        }
    });
};

exports.getAll = (req, res) => {
    Subscription.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Subscriptions."
            });
        } else {
            res.status(200).send(data);
        }
    });
};

exports.getByUserId = (req, res) => {
    const userId = req.params.userId;

    Subscription.getByUserId(userId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Subscriptions."
            });
        } else {
            res.status(200).send(data);
        }
    });
};

exports.getByFeedId = (req, res) => {
    const feedId = req.params.feedId;

    Subscription.getByFeedId(feedId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Subscriptions."
            });
        } else {
            res.status(200).send(data);
        }
    });
};

exports.delete = (req, res) => {
    const { userId, feedId } = req.body;

    Subscription.delete(userId, feedId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the Subscription."
            });
        } else {
            res.status(200).send({message: "Subscription sucessfully deleted." });
        }
    });
};

exports.deleteByUserId = (req, res) => {
    const userId = req.params.userId;

    Subscription.deleteByUserId(userId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the Subscription."
            });
        } else {
            res.status(200).send({message: "Subscription sucessfully deleted." });
        }
    });
};

exports.deleteByFeedId = (req, res) => {
    const feedId = req.params.feedId;

    Subscription.deleteByFeedId(feedId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the Subscription."
            });
        } else {
            res.status(200).send({message: "Subscription sucessfully deleted." });
        }
    });
};

exports.deleteAll = (req, res) => {
    Subscription.deleteAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the Subscriptions."
            });
        } else {
            res.status(200).send({message: "Subscriptions sucessfully deleted." });
        }
    });
};

exports.deleteAllByUserId = (req, res) => {
    const userId = req.params.userId;

    Subscription.deleteAllByUserId(userId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the Subscriptions."
            });
        } else {
            res.status(200).send({message: "Subscriptions sucessfully deleted." });
        }
    });
};
