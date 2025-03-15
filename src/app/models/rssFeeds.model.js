const db = require("../config/db");

class RssFeeds {
    constructor(id, title, url, category) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.category = category;
    }

    static getAll(result) {
        const query = "SELECT * FROM rss_feeds";
        db.query(query, result);
    }

    static getById(id, result) {
        const query = "SELECT * FROM rss_feeds WHERE id = ?";
        db.query(query, id, result);
    }

    static getByCategory(category, result) {
        const query = "SELECT * FROM rss_feeds WHERE category = ?";
        db.query(query, category, result);
    }

    static create(newRssFeed, result) {
        const query = "INSERT INTO rss_feeds SET ?";
        db.query(query, newRssFeed, result);
    }

    static updateById(id, rssFeed, result) {
        const query = "UPDATE rss_feeds SET ? WHERE id = ?";
        db.query(query, [rssFeed, id], result);
    }

    static deleteById(id, result) {
        const query = "DELETE FROM rss_feeds WHERE id = ?";
        db.query(query, id, result);
    }
}

module.exports = RssFeeds;