const db = require("../config/db");

class Subscriptions {
    constructor(id, user_id, feed_id) {
        this.id = id;
        this.user_id = user_id;
        this.feed_id = feed_id;
    }

    static getAll(result) {
        const query = "SELECT * FROM subscriptions";
        db.query(query, result);
    }

    static getById(id, result) {
        const query = "SELECT * FROM subscriptions WHERE id = ?";
        db.query(query, id, result);
    }

    static getByUserId(user_id, result) {
        const query = "SELECT * FROM subscriptions WHERE user_id = ?";
        db.query(query, user_id, result);
    }

    static getByFeedId(feed_id, result) {
        const query = "SELECT * FROM subscriptions WHERE feed_id = ?";
        db.query(query, feed_id, result);
    }

    static create(newSubscription, result) {
        const query = "INSERT INTO subscriptions SET ?";
        db.query(query, newSubscription, result);
    }

    static deleteById(id, result) {
        const query = "DELETE FROM subscriptions WHERE id = ?";
        db.query(query, id, result);
    }

    static deleteByUserId(user_id, result) {
        const query = "DELETE FROM subscriptions WHERE user_id = ?";
        db.query(query, user_id, result);
    }

    static deleteByFeedId(feed_id, result) {
        const query = "DELETE FROM subscriptions WHERE feed_id = ?";
        db.query(query, feed_id, result);
    }

    static deleteByUserIdAndFeedId(user_id, feed_id, result) {
        const query = "DELETE FROM subscriptions WHERE user_id = ? AND feed_id = ?";
        db.query(query, [user_id, feed_id], result);
    }

}

module.exports = Subscriptions;